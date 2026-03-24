import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

const API_KEY = process.env.XAI_API_KEY;
if (!API_KEY) { console.error("Set XAI_API_KEY env var"); process.exit(1); }

const BASE = "https://api.x.ai/v1";
const VIDEOS_DIR = path.join(process.cwd(), "public", "videos");
const CONCURRENCY = 3;
const POLL_INTERVAL = 10_000; // 10 seconds

const CHARACTER = "Woman in her 30s, dark hair tied back, practical farm clothing — green vest over flannel shirt, jeans, muddy boots.";
const STYLE = "Vertical 9:16 aspect ratio, cinematic quality, realistic style, natural lighting, no text overlays, no UI elements, no words on screen.";
const SUFFIX = `${CHARACTER} ${STYLE}`;

const PROMPTS = [
  // LEVEL 1
  {
    id: "1",
    prompt: `A woman farmer in her 30s walks through a golden wheat field at sunrise. She stops, kneels, picks up a wheat stalk — close-up reveals ugly brown-yellow spots covering the leaves. She stands up alarmed. Looks at dozens of surrounding stalks — all infected. She holds a diseased stalk in one hand. Final shot: she looks directly at camera with a questioning expression, as if asking "What should I do?" Dramatic pause on her face. Cinematic, warm morning light.`
  },
  // LEVEL 2
  {
    id: "2-1A",
    prompt: `The farmer crouches in the field, holds her smartphone steady, and photographs a diseased wheat leaf up close. The phone screen shows a scanning animation — a crop health diagnostic tool analyzing the image. The result appears: red warning icon. She reads the screen showing "Recommended: apply fungicide within 48 hours." She looks up from the phone toward her barn where treatment supplies are stored, then looks back at the phone screen. Final freeze: she holds the phone in one hand, looks toward the barn — clearly deciding whether to act immediately. Decision moment.`
  },
  {
    id: "2-1B",
    prompt: `Time-lapse: three sunrises and sunsets over a wheat field. Each day the brown-yellow patches grow visibly larger. On day three, the farmer returns to the field edge. Drone shot reveals: disease has spread to nearly a third of the crop — massive brown patches amid the gold. She walks into the damaged section, picks up a stalk that crumbles in her hand. She pulls out her phone, finger hovering over a "Call Agronomist" button. Final freeze: her thumb over the call button, face tense — clearly deciding whether to make the call. Decision moment.`
  },
  // LEVEL 3
  {
    id: "3-1A2A",
    prompt: `Farmer strides into her barn, grabs a fungicide container from the shelf. She reads the dosage label, mixes the solution in a tank sprayer. Loads the sprayer onto her tractor. Drives to the field edge. She looks out at the vast wheat field — it's enormous. The tractor is ready, engine running. She glances at the fuel gauge, then at the field stretching to the horizon. Final freeze: she grips the steering wheel, looking between the full field ahead and the half-full tank beside her — clearly deciding whether to treat everything or just the worst sections. Decision moment.`
  },
  {
    id: "3-1A2B",
    prompt: `Two weeks later. The farmer walks through the field — some areas look the same, but others are clearly worse. She bends down, compares a healthy stalk to a sick one side by side. New spots appearing on previously healthy plants. She stands at the exact boundary where healthy wheat meets diseased wheat. The disease is crossing over. She pulls out her phone, opens a diagnostic app — it now shows a critical red warning. Final freeze: she holds the phone showing the critical warning, looking at the spreading disease line in front of her — deciding whether to finally act or keep waiting. Decision moment.`
  },
  {
    id: "3-1B2A",
    prompt: `Farmer on the phone, pacing by her truck. Urgent conversation — she's gesturing at the field. A van arrives: an agronomist in a branded vest steps out with a testing kit. They walk the field together, the agronomist takes soil samples, examines leaves with a magnifying glass. The agronomist writes a treatment prescription on a clipboard and hands it to the farmer. The prescription lists two options. Final freeze: the farmer holds the prescription, eyes moving between the two options circled on the page — deciding which treatment to commit to. Decision moment.`
  },
  {
    id: "3-1B2B",
    prompt: `The farmer walks through her field alone — no help called, no treatment applied. Wide shots reveal the disease now covers nearly half the crop. Dead brown stalks everywhere. She reaches the center of the worst section, surrounded by ruined wheat. She kneels, picks up a handful of dry, diseased grain heads — they crumble to dust. She stands and looks toward the remaining healthy section of the field, still golden. Final freeze: she faces the boundary between dead and living crop, arms at her sides — deciding whether to try to save what's left or accept total loss. Decision moment.`
  },
  // LEVEL 4
  {
    id: "4-1A2A3A",
    prompt: `Tractor spraying the entire field at golden hour. Beautiful mist of fungicide catching the sunlight. The farmer drives row after row with precision. Time-lapse: 48 hours later, she walks through the treated field. Close-up of leaves — the brown spots have stopped spreading. But she notices one far corner she might have missed. New small spots appearing there. She holds a fresh leaf with tiny new spots. Final freeze: she looks at the almost-empty fungicide tank, then at the small untreated corner — deciding whether to go buy more product or call it done. Decision moment.`
  },
  {
    id: "4-1A2A3B",
    prompt: `Farmer finishes treating only the visibly sick sections. She parks the tractor, satisfied she saved product for later. Time-lapse: 10 days pass. She returns to check — the treated sections look better, but the disease has jumped to previously healthy areas she skipped. The untreated sections now look worse than the originals did. She stands at the new infection boundary, holding unused fungicide she saved. Final freeze: she looks at the new damage spreading, then at the treatment supplies still in the barn — deciding whether to use everything now or accept the loss. Decision moment.`
  },
  {
    id: "4-1A2B3A",
    prompt: `Farmer finally treating the field after weeks of delay. She works urgently, spraying affected areas. Time-lapse: one week. She checks the results. The early-infected areas are too far gone — stalks dry and dead. But the newly infected areas responded to treatment — green returning. Mixed result visible: dead section and recovering section side by side. She stands between them. Final freeze: she looks at the recovering section, then at the dead one — deciding whether to plow under the dead section to prevent re-infection, or leave it. Decision moment.`
  },
  {
    id: "4-1A2B3B",
    prompt: `Farmer still hasn't treated. The field is devastated — 70% brown and dead. She walks through the destruction in disbelief. She pulls out her phone, scrolls back to an old diagnostic warning. She was warned. A neighbor's combine harvester is visible in the distance, harvesting a healthy field. She looks at her ruined crop, then at her phone. An agronomist's number is on screen. Final freeze: her finger hovers over the call button — deciding whether to swallow her pride and call for help to save the last 30%, or give up entirely. Decision moment.`
  },
  {
    id: "4-1B2A3A",
    prompt: `The agronomist's full treatment plan in action. Professional spraying crew arrives with industrial equipment. They treat the entire field methodically. The farmer watches the cost counter on the service invoice climbing. Time-lapse: two weeks. The treated areas show dramatic improvement — green returning, new growth visible. But the bill arrives. The farmer sits at her kitchen table, looking at the treatment invoice and her bank balance on the laptop. Final freeze: she holds the invoice in one hand, looks at the recovering field through the window — deciding about the investment. Decision moment.`
  },
  {
    id: "4-1B2A3B",
    prompt: `The cheaper partial treatment being applied to the worst sections only. Some areas respond, others don't. Two weeks later: the treated sections show improvement but the untreated areas have degraded further. The agronomist returns, shakes his head at the untreated sections. He points to the boundary — disease crossing into treated zones again. He writes an urgent upgrade recommendation on his clipboard. Hands it to the farmer. Final freeze: she reads the note, looks at the re-infected boundary, hand on her wallet — deciding whether to pay for the full upgrade or stick with what she has. Decision moment.`
  },
  {
    id: "4-1B2B3A",
    prompt: `Farmer racing to save the remaining healthy 50% of her crop. She builds a firebreak — plowing a strip between healthy and diseased sections. She applies treatment only to the healthy side. Intense, physical work. She checks the weather app — rain coming in two days that could spread spores. She looks at the protective barrier she built, then at the sky. Final freeze: rain clouds gathering on the horizon, her treated healthy section on one side, the disease on the other — deciding whether to add extra protective covering or trust the barrier alone. Decision moment.`
  },
  {
    id: "4-1B2B3B",
    prompt: `The field is almost entirely dead. Brown, dry, lifeless. The farmer walks the perimeter one last time. She finds one small patch — maybe 20 square meters — where wheat still looks green and alive. Hidden in a low-lying area that stayed moist. She kneels beside it. Healthy stalks. She looks around at the devastation, then back at this tiny surviving patch. Final freeze: she cups a handful of healthy wheat heads, looks at this last hope — deciding whether to invest in protecting this tiny patch for seed stock, or walk away from the whole field. Decision moment.`
  },
  // LEVEL 5 — Endings
  {
    id: "5-1A2A3A4A",
    prompt: `Harvest day. Combine harvester rolling through golden wheat. The farmer watches from her truck, smiling wide. Grain pouring into the trailer — overflowing abundance. She jumps out, grabs a handful of grain, holds it up to the sun. It glows golden. She throws it in the air like confetti. Sunset over the fully harvested field. Pure triumph. She leans against her truck, arms crossed, looking at the clean field. The best season she's ever had.`
  },
  {
    id: "5-1A2A3A4B",
    prompt: `Harvest day. Most of the field yields beautifully. But one small corner — stunted, thin crop. She harvests it separately — meager pile next to the abundant main harvest. She writes in her notebook: a lesson learned. Closes the book. Looks at the 95% success. Smiles. Lessons absorbed. She drives the loaded grain truck home at sunset.`
  },
  {
    id: "5-1A2A3B4A",
    prompt: `The dead section is plowed under, black soil where wheat once stood. But the recovering section delivered — farmer harvesting healthy wheat from it. Yield is 60% of normal. She loads grain bags, counts them. Not a great season, but a saved one. She looks at the plowed section — already planning to reseed it. Final shot: she plants cover crop seeds in the bare soil. Recovery in motion.`
  },
  {
    id: "5-1A2A3B4B",
    prompt: `Split harvest. One side golden and productive, the other side sparse and sad. The farmer harvests both. Two separate piles at the barn — one full, one barely there. She calculates totals on a clipboard. Just above break-even. She shakes her head but manages a small smile — could have been worse. She pins a diagnostic app screenshot to her wall as a reminder.`
  },
  {
    id: "5-1A2B3A4A",
    prompt: `Farmer receives the final harvest count. It's decent — late treatment worked partially. But she also looks at the total cost of treatment. Profit margin is thin. She sighs, then smiles — the crop survived, the farm survived. She picks up an agronomist's business card on her desk. Cut to: she's on the phone ordering a preventive treatment schedule for next season. Proactive now.`
  },
  {
    id: "5-1A2B3A4B",
    prompt: `Partial treatment wasn't enough. The harvest is poor despite the spending. Farmer sits at her kitchen table with receipts spread out. Treatment costs plus poor yield equals loss this season. She puts her head in her hands briefly. Then straightens up, opens her laptop, searches for crop insurance. Takes control. Final shot: she meets with an insurance agent, signing papers. Protecting herself for next time.`
  },
  {
    id: "5-1A2B3B4A",
    prompt: `Emergency treatment saved the crop. Farmer harvests a solid yield. She compares the originally-treated sections with the late-treated sections. Overall — a profitable season. She shakes the agronomist's hand at the field gate. Orders the full treatment plan as a standing subscription. Final shot: healthy wheat, blue sky. She made the right call, even if it was late.`
  },
  {
    id: "5-1A2B3B4B",
    prompt: `Almost no harvest. The farmer drives an empty grain truck back to the barn. She closes the barn doors on a nearly empty storage area. Sits on a crate outside. Long pause. Then she pulls out her phone, opens a farming forum, and starts typing a question. Comments pour in — a community responds. She reads, nods, takes notes. Final shot: a calendar on the wall with next season's scouting dates already marked.`
  },
  {
    id: "5-1B2A3A4A",
    prompt: `Despite the late start and high costs, the full treatment plus continued care delivered a respectable harvest. Not a record, but the farm is profitable. Farmer stands with the agronomist reviewing the season's data on a tablet. They shake hands. She writes a check for the treatment — winces at the amount but smiles. Worth it. Final shot: she installs a permanent weather station in the field. Never caught off guard again.`
  },
  {
    id: "5-1B2A3A4B",
    prompt: `Full treatment but no follow-up — disappointing harvest. The farmer loads modest grain bags. She looks at what she saved by cutting corners, then at what she lost in yield. The math doesn't work. She visits the agronomist's office, sits down. She's done cutting corners. Final shot: a proper treatment calendar posted on her barn wall.`
  },
  {
    id: "5-1B2A3B4A",
    prompt: `The upgraded treatment worked. The healthy section survived — farmer reveals green, undamaged wheat under protective covering. She harvests it — a decent yield from the protected area. The diseased side is ruined but contained. She burns the infected stubble safely. Field reset. Next season starts clean.`
  },
  {
    id: "5-1B2A3B4B",
    prompt: `Rain spread the disease spores across the barrier. The partial treatment wasn't enough. Farmer pulls back covering — damage everywhere. The rain undid her work. She stands in the ruined field as clouds break and sun comes through. Devastating but beautiful image. She walks to the barn, opens her laptop. Searches for disease-resistant wheat varieties. Planning the comeback. Final shot: a seed catalog bookmarked on her screen.`
  },
  {
    id: "5-1B2B3A4A",
    prompt: `A tiny surviving patch is thriving under protective netting. Farmer carefully harvests it by hand — not for sale, for seed stock. She fills small labeled bags for next season. Stores them in a dry, cool place in the barn. She clears and prepares the rest of the field for replanting. Final shot: spring. She plants those saved seeds. First green shoots emerge. Full circle. She kneels and touches the new growth. Hope.`
  },
  {
    id: "5-1B2B3A4B",
    prompt: `The field is cleared — bare soil. The farmer walks away from it toward her farmhouse. Inside, she sits at her desk surrounded by agricultural books and her laptop. She designs a complete new approach: resistant varieties, early monitoring, preventive treatment schedule. Time-lapse through winter. Spring arrives. She's back in the field with new seeds, new tools, new confidence. Final shot: perfect rows of fresh green wheat.`
  },
  {
    id: "5-1B2B3B4A",
    prompt: `One year later. The same field — but completely transformed. Lush, tall, healthy wheat everywhere. The farmer walks through it, running her hands along the tops. She stops at the exact spot where the last surviving patch was. A small marker in the ground. She smiles. Combine harvester in the background, ready to go. The best season yet — born from the worst.`
  },
  {
    id: "5-1B2B3B4B",
    prompt: `Empty, plowed field. The farmer sits on a hay bale at the edge, staring at nothing. A long moment. Then she stands up. Next scenes rapid: meeting with a bank advisor, attending a farming workshop, studying soil health charts, testing new seed varieties in small pots at home. Winter passes. Spring. She's back — new seeds, new plan, a small monitoring drone on her truck. She plants the first row. Kneels, touches the soil. Final shot: sunrise over the field. Everything begins again.`
  }
];

async function apiCall(method, url, body) {
  const opts = {
    method,
    headers: { "Authorization": `Bearer ${API_KEY}`, "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text}`);
  }
  return res.json();
}

async function startGeneration(prompt) {
  return apiCall("POST", `${BASE}/videos/generations`, {
    model: "grok-imagine-video",
    prompt: `${prompt} ${SUFFIX}`,
    duration: 15,
    aspect_ratio: "9:16",
    resolution: "720p"
  });
}

async function pollResult(requestId) {
  while (true) {
    const data = await apiCall("GET", `${BASE}/videos/${requestId}`);
    if (data.status === "done") return data;
    if (data.status === "failed" || data.status === "expired") {
      throw new Error(`Generation ${data.status}: ${JSON.stringify(data)}`);
    }
    process.stdout.write(".");
    await new Promise(r => setTimeout(r, POLL_INTERVAL));
  }
}

async function downloadVideo(url, filepath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  await writeFile(filepath, buffer);
}

async function generateOne(item) {
  const filepath = path.join(VIDEOS_DIR, `${item.id}.mp4`);
  if (existsSync(filepath)) {
    console.log(`  [SKIP] ${item.id}.mp4 already exists`);
    return { id: item.id, status: "skipped" };
  }

  try {
    console.log(`  [START] ${item.id} — requesting generation...`);
    const startData = await startGeneration(item.prompt);
    const requestId = startData.request_id || startData.id;
    console.log(`  [POLL]  ${item.id} — request_id: ${requestId}`);

    const result = await pollResult(requestId);
    const videoUrl = result.video?.url || result.url;
    if (!videoUrl) throw new Error(`No video URL in response: ${JSON.stringify(result)}`);

    console.log(`\n  [DOWNLOAD] ${item.id} — saving...`);
    await downloadVideo(videoUrl, filepath);
    console.log(`  [DONE] ${item.id}.mp4 saved`);
    return { id: item.id, status: "done" };
  } catch (err) {
    console.error(`\n  [FAIL] ${item.id}: ${err.message}`);
    return { id: item.id, status: "failed", error: err.message };
  }
}

async function runBatch(items, concurrency) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    console.log(`\n--- Batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(items.length / concurrency)} (${batch.map(b => b.id).join(", ")}) ---`);
    const batchResults = await Promise.all(batch.map(generateOne));
    results.push(...batchResults);
  }
  return results;
}

async function main() {
  if (!existsSync(VIDEOS_DIR)) await mkdir(VIDEOS_DIR, { recursive: true });

  console.log(`\n=== Generating ${PROMPTS.length} videos via xAI Grok API ===`);
  console.log(`Concurrency: ${CONCURRENCY} | Resolution: 720p | Duration: 15s | Aspect: 9:16\n`);

  const results = await runBatch(PROMPTS, CONCURRENCY);

  const done = results.filter(r => r.status === "done").length;
  const skipped = results.filter(r => r.status === "skipped").length;
  const failed = results.filter(r => r.status === "failed");

  console.log(`\n=== COMPLETE ===`);
  console.log(`Generated: ${done} | Skipped: ${skipped} | Failed: ${failed.length}`);
  if (failed.length > 0) {
    console.log(`\nFailed videos:`);
    failed.forEach(f => console.log(`  - ${f.id}: ${f.error}`));
  }
}

main().catch(err => { console.error("Fatal:", err); process.exit(1); });
