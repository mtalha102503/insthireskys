'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Trash2, Plus, Loader2, Image as ImageIcon, UploadCloud } from 'lucide-react';
import { clearLandingPageCache } from '@/app/actions';

export default function AdminConsole() {
  const [slug, setSlug] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null); // 🔥 Image file ke liye state
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [featuredJobs, setFeaturedJobs] = useState<any[]>([]);

  useEffect(() => {
    fetchFeaturedJobs();
  }, []);

  const fetchFeaturedJobs = async () => {
    const { data } = await supabase
      .from('ig_featured_jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (data) setFeaturedJobs(data);
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!slug) {
      setMessage('❌ Please enter a job slug.');
      return;
    }
    
    setLoading(true);
    setMessage('');

    try {
      // 1. Fetch exact job from the main 'jobs' table
      const { data: jobData, error: fetchError } = await supabase
        .from('jobs')
        .select('title, company, job_type, slug')
        .eq('slug', slug)
        .single();

      if (fetchError || !jobData) {
        setMessage('❌ Job not found! Slug check karo.');
        setLoading(false);
        return;
      }

      let finalImageUrl = null;

      // 2. Agar image select ki hai, to pehle Supabase Storage mein upload karo
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`; // Unique file name
        
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('thumbnails') // 🔥 Ensure karo ke Supabase mein 'thumbnails' naam ka public bucket ho
          .upload(fileName, imageFile);

        if (uploadError) {
          setMessage('❌ Image upload failed!');
          setLoading(false);
          return;
        }

        // 3. Uploaded image ka Public URL get karo
        const { data: publicUrlData } = supabase.storage
          .from('thumbnails')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      // 4. Job ko database mein save karo (with image URL)
      const { error: insertError } = await supabase
        .from('ig_featured_jobs')
        .insert([{
          slug: jobData.slug,
          title: jobData.title,
          company: jobData.company,
          job_type: jobData.job_type || 'Remote',
          image_url: finalImageUrl 
        }]);

      if (insertError) {
        setMessage('❌ Error saving job. Shayad pehle se added hai.');
      } else {
        setMessage('✅ Job added with Thumbnail!');
        setSlug('');
        setImageFile(null);
        fetchFeaturedJobs(); 
        await clearLandingPageCache();
      }
    } catch (error) {
      setMessage('❌ System error.');
      console.error(error);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    setMessage('');
    const { error } = await supabase.from('ig_featured_jobs').delete().eq('id', id);
    if (!error) {
      fetchFeaturedJobs();
      await clearLandingPageCache();
      setMessage('✅ Job removed!');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-white rounded-xl shadow-md border border-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Instagram Jobs Console</h1>
      
      <form onSubmit={handleAddJob} className="flex flex-col gap-4 mb-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Job Slug</label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. senior-react-developer"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Thumbnail Image</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
              className="flex-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 mt-2 rounded-lg font-bold hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
          Save to Instagram Page
        </button>
      </form>

      {message && <p className="mb-6 text-sm font-bold text-gray-700 bg-white p-3 rounded-lg border border-gray-200">{message}</p>}

      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Currently Live on IG Page</h2>
        <div className="space-y-3">
          {featuredJobs.map((job) => (
            <div key={job.id} className="flex justify-between items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              <div className="flex items-center gap-4">
                {job.image_url ? (
                  <img src={job.image_url} alt="thumbnail" className="w-12 h-12 rounded-md object-cover border border-gray-200" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(job.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {featuredJobs.length === 0 && <p className="text-gray-500 text-sm italic">No jobs added yet.</p>}
        </div>
      </div>
    </div>
  );
}
