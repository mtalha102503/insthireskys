'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase';
import { Trash2, Plus, Loader2, Image as ImageIcon } from 'lucide-react';
import { clearLandingPageCache } from '@/app/actions';

export default function AdminConsole() {
  const [slug, setSlug] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // 🔥 Image ke liye new state
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
    if (!slug) return;
    
    setLoading(true);
    setMessage('');

    try {
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

      const { error: insertError } = await supabase
        .from('ig_featured_jobs')
        .insert([{
          slug: jobData.slug,
          title: jobData.title,
          company: jobData.company,
          job_type: jobData.job_type || 'Remote',
          image_url: imageUrl // 🔥 Image URL database mein save ho raha hai
        }]);

      if (insertError) {
        setMessage('❌ Error saving job. Shayad pehle se added hai.');
      } else {
        setMessage('✅ Job added with Thumbnail!');
        setSlug('');
        setImageUrl('');
        fetchFeaturedJobs(); 
        await clearLandingPageCache();
      }
    } catch (error) {
      setMessage('❌ System error.');
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
      
      <form onSubmit={handleAddJob} className="flex flex-col gap-3 mb-4">
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="Enter exact job slug"
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <div className="flex gap-3">
          <input
            type="text"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Paste Instagram Image URL (Optional)"
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Add Job
          </button>
        </div>
      </form>

      {message && <p className="mb-6 text-sm font-medium text-gray-700">{message}</p>}

      <div>
        <h2 className="text-lg font-semibold mb-4 text-gray-800 border-b pb-2">Currently Live on IG Page</h2>
        <div className="space-y-3">
          {featuredJobs.map((job) => (
            <div key={job.id} className="flex justify-between items-center p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-4">
                {job.image_url ? (
                  <img src={job.image_url} alt="thumbnail" className="w-12 h-12 rounded-md object-cover border border-gray-300" />
                ) : (
                  <div className="w-12 h-12 rounded-md bg-gray-200 flex items-center justify-center border border-gray-300">
                    <ImageIcon className="w-5 h-5 text-gray-400" />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-sm text-gray-500">{job.company}</p>
                </div>
              </div>
              <button onClick={() => handleDelete(job.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}