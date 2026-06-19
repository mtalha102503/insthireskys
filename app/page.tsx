import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Globe, Sparkles, ImageIcon, Users } from 'lucide-react';
import { supabase } from '@/utils/supabase';
import SearchBox from '@/components/SearchBox';

export const revalidate = false;

export default async function InstagramLandingPage() {
  const { data: featuredJobs, error } = await supabase
    .from('ig_featured_jobs')
    .select('id, slug, title, company, job_type, image_url') 
    .order('created_at', { ascending: false });

  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center sm:py-12">
      <div className="w-full max-w-3xl bg-white sm:rounded-3xl shadow-2xl overflow-hidden min-h-screen sm:min-h-0 pb-10">
        
        {/* Banner Section */}
        <div className="relative w-full h-48 sm:h-64 bg-blue-600">
          <Image 
            src="/banner.jpg" 
            alt="HireSkys Banner" 
            fill 
            priority 
            className="object-cover opacity-95" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>

        {/* Profile Header */}
        <div className="px-8 -mt-16 sm:-mt-20 relative z-10 text-center">
          <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white rounded-full mx-auto p-1.5 shadow-xl mb-4 relative">
            <div className="w-full h-full relative rounded-full overflow-hidden bg-white flex items-center justify-center">
              <Image 
                src="/logo2.png" 
                alt="HireSkys Logo" 
                fill 
                className="object-contain p-2" 
              />
            </div>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">HireSkys</h1>
          <p className="text-gray-600 mt-2 text-base flex items-center justify-center gap-1.5 font-medium">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            100% Manually Verified Remote Jobs
          </p>
        </div>

        <div className="px-6 sm:px-10 mt-8 space-y-8">
          
          <SearchBox />

          {/* Primary Links */}
          <div className="space-y-4">
            {/* Link 1: Browse Jobs */}
            <Link href="https://www.hireskys.com" className="flex items-center justify-between w-full p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-xl group-hover:bg-blue-600 transition-colors">
                  <Globe className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-lg font-semibold text-gray-800">Browse All Remote Jobs</span>
              </div>
              <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </Link>

            {/* Link 2: Post a Job */}
            <Link href="https://www.hireskys.com/post-job" className="flex items-center justify-between w-full p-5 bg-blue-600 rounded-2xl shadow-md hover:bg-blue-700 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/50 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-lg font-semibold text-white">Post a Job</span>
              </div>
              <ArrowRight className="w-6 h-6 text-blue-200 group-hover:text-white transition-colors translate-x-0 group-hover:translate-x-1" />
            </Link>

            {/* 🔥 Link 3: ATS Link (Premium Style) */}
            <Link href="https://www.hireskys.com/ats" className="flex items-center justify-between w-full p-5 bg-purple-50 rounded-2xl border border-purple-100 hover:border-purple-400 hover:shadow-md transition-all group">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-xl group-hover:bg-purple-600 transition-colors">
                  <Users className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-lg font-semibold text-purple-900">Free ATS Software</span>
              </div>
              <ArrowRight className="w-6 h-6 text-purple-300 group-hover:text-purple-600 transition-colors" />
            </Link>
          </div>

          {/* Dynamic Featured Jobs Section (With Thumbnails) */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-5 px-1">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                🔥 Hot Remote & Freelance Roles
              </h2>
            </div>
            
            <div className="space-y-4">
              {featuredJobs && featuredJobs.length > 0 ? (
                featuredJobs.map((job) => (
                  <Link key={job.id} href={`https://www.hireskys.com/jobs/${job.slug}`} className="block group">
                    <div className="p-5 bg-white border border-gray-200 rounded-2xl shadow-sm hover:border-blue-300 hover:shadow-md transition-all relative overflow-hidden flex gap-5 items-center">
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>
                      
                      {job.image_url ? (
                        <img 
                          src={job.image_url} 
                          alt={job.title} 
                          className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover flex-shrink-0 border border-gray-100 shadow-sm"
                        />
                      ) : (
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center flex-shrink-0">
                          <ImageIcon className="w-8 h-8 text-gray-300" />
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">{job.title}</h3>
                        <p className="text-base text-gray-500 mt-1 line-clamp-1">{job.company}</p>
                        <div className="flex gap-2 mt-3">
                          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md uppercase tracking-wider">
                            Verified
                          </span>
                          <span className="px-2.5 py-1 bg-gray-50 text-gray-600 text-xs font-semibold rounded-md border border-gray-200 uppercase tracking-wider">
                            {job.job_type || 'Remote'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-8 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <p className="text-base text-gray-500 font-medium">No featured jobs right now.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}