import express from 'express';
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.post('/api/queue', async (req,res)=>{
  const { user_id, command } = req.body;
  if (!user_id || !command) return res.status(400).json({error:'missing fields'});

  const { data, error } = await supabase
    .from('job_queue')
    .insert({ user_id, command });

  if (error) return res.status(500).json({ error:error.message });
  res.json({ status:'queued', job:data[0] });
});

app.get('/',(req,res)=>res.send('Queue API OK'));

app.listen(8080,()=>console.log('API on 8080'));