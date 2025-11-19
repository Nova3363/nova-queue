import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

async function loop() {
  const { data: jobs } = await supabase
    .from('job_queue')
    .select('*')
    .eq('status','pending')
    .order('created_at')
    .limit(1);

  if (!jobs || jobs.length === 0) return;

  const job = jobs[0];
  console.log('Running job:', job.id);

  await supabase.from('job_queue').update({ status:'running' }).eq('id',job.id);
  await new Promise(r=>setTimeout(r,2000));
  const result = `تم تنفيذ الأمر: ${job.command}`;
  await supabase.from('job_queue').update({ status:'done', result }).eq('id',job.id);

  console.log('Done:', job.id);
}

setInterval(loop, 3000);