import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractTextFromPdf } from '@/lib/pdf';
import { randomUUID } from 'crypto';

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

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'A valid PDF file is required' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const extractedText = await extractTextFromPdf(buffer);

    const contractId = randomUUID();
    const storagePath = `${user.id}/${contractId}.pdf`;

    const { error: uploadError } = await supabase.storage
      .from('contracts')
      .upload(storagePath, buffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    const { data: contract, error: dbError } = await supabase
      .from('contracts')
      .insert({
        id: contractId,
        user_id: user.id,
        file_name: file.name,
        file_url: storagePath,
        status: 'pending',
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database insert error:', dbError);
      await supabase.storage.from('contracts').remove([storagePath]);
      return NextResponse.json(
        { error: 'Failed to create contract record' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      contract,
      extractedText,
    });
  } catch (error) {
    console.error('Upload error:', error);
    const message =
      error instanceof Error ? error.message : 'Upload failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
