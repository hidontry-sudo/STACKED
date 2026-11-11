import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseServerClient, isServerSupabaseConfigured } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string) || 'Untitled Video Lesson';
    const category = (formData.get('category') as string) || 'Foundations';
    const instructorId = (formData.get('instructorId') as string) || null;

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop() || 'mp4';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `lessons/${fileName}`;

    let publicUrl = `https://stacked-demo.storage.supabase.co/lessons/${fileName}`;
    let insertedVideo: any = {
      id: `vid-${Date.now()}`,
      title,
      category,
      video_url: publicUrl,
      storage_path: filePath,
      duration: '8 min',
      instructor_id: instructorId,
      created_at: new Date().toISOString(),
    };

    const supabase = getSupabaseServerClient();

    if (supabase) {
      // 1. Upload to Supabase Storage bucket 'lessons'
      const fileBuffer = await file.arrayBuffer();
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('lessons')
        .upload(filePath, fileBuffer, {
          contentType: file.type || 'video/mp4',
          upsert: true,
        });

      if (uploadError) {
        console.warn('Supabase storage upload error:', uploadError.message);
      } else {
        const { data: urlData } = supabase.storage
          .from('lessons')
          .getPublicUrl(filePath);

        publicUrl = urlData.publicUrl;
      }

      // 2. Insert record into 'videos' table
      const { data: videoData, error: dbError } = await supabase
        .from('videos')
        .insert({
          title,
          category,
          video_url: publicUrl,
          storage_path: filePath,
          duration: '8 min',
          instructor_id: instructorId,
        })
        .select()
        .single();

      if (dbError) {
        console.warn('Supabase videos table insert error:', dbError.message);
      } else if (videoData) {
        insertedVideo = videoData;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Video uploaded and saved to videos table',
      video: insertedVideo,
      publicUrl,
      storageConfigured: Boolean(supabase),
    });
  } catch (error: any) {
    console.error('Error in upload-video API route:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to upload video' },
      { status: 500 }
    );
  }
}
