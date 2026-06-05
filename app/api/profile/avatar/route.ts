import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateAvatarUrl } from '@/app/profile/actions';

const MAX_SIZE = 2 * 1024 * 1024;
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !ALLOWED.includes(file.type)) {
      return NextResponse.json(
        { error: 'Upload a JPG, PNG, WebP, or GIF under 2MB' },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Image must be under 2MB' },
        { status: 400 }
      );
    }

    const ext = file.type.split('/')[1].replace('jpeg', 'jpg');
    const path = `${user.id}/avatar.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error('Avatar upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload photo. Create an avatars bucket in Supabase.' },
        { status: 500 }
      );
    }

    const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path);
    const result = await updateAvatarUrl(urlData.publicUrl);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ avatarUrl: urlData.publicUrl });
  } catch (error) {
    console.error('Avatar route error:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
