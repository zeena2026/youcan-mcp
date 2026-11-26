---
name: ugc-video
description: Create realistic AI UGC (user-generated-content style) product videos with Freepik / Magnific for TIRGAZEA or any store product. Use when the user asks for a UGC video, a creator/testimonial video, a "talking to camera" review, a TikTok/Reels-style product ad, or more UGC variations of a product.
---

# Realistic UGC product videos (Freepik / Magnific)

The user approved this style. Follow it for every UGC video unless the user asks otherwise.

## 1. Get the real product
1. Read the product page (e.g. `https://tirgazea.com/product/<slug>/`). Take the product name, the claims on the page and the image URLs (`og:image` and gallery `wp-content/uploads/...webp`).
2. Import the images into Freepik with `creations_upload_image`, using their public URLs. Use `creations_read` to check what the packaging and label look like (colours, lid, label text).
3. In `video_generate` `references`, pass:
   - `{type: "product", url: <main packshot>}`
   - `{type: "image", url: <open product / texture shot>}`

## 2. Settings
- `slug: "bytedance-seedance-pro-2.5"` (Seedance 2.5)
- `aspectRatio: "9:16"`, `resolution: "720p"`, `duration: 15`
- `withSoundEffects: true`, `noMusic: true`
- Prompt ends with: "no background music, no on-screen text, no subtitles".
- Cost: about 6,600 credits per video. Run `simulate_cost`, give the user the price, and wait for an explicit "yes" (Freepik refuses the call with `cost_confirmation_required` until then). Then send exactly the same call again.

## 3. Realism rules (the most important part)
- The **phone sits on a stand** facing the creator at chest height (not a handheld selfie), so both hands are free.
- Every action is physical and shown step by step. **Nothing moves by itself**: no flying lids, no cream appearing on the skin.
  - She holds the jar in one hand and **twists the lid off with the other** (two small turns), lifts it off and sets it down on the counter.
  - She takes a **small, pea-sized amount** with her fingertip and shows it to the camera.
  - She **applies it gently**, with slow strokes in the right direction for the product (neck: from the base upward toward the jaw).
- Always include in the prompt: "All movements are slow, natural and physically realistic, like a real person filmed in real time; every action is clearly shown step by step, nothing happens by itself. Realistic hand anatomy."
- Show the label to the camera **at the start and at the end** (jar held next to her face, label facing the lens).

## 4. Variety
- Use a **new face and a new setting** for every video, so ads can be A/B tested. Settings: bright bathroom vanity with marble, bedroom with window light, dressing table, living room sofa. Note in your reply which faces and settings have already been used.
- Language: English by default. Offer Gulf Arabic (Khaleeji) for UAE shoppers, or French.
- About 3 short, genuine lines spread across the 15 s. Only make claims the product page makes (e.g. "smoother", "firmer-looking", "hydrated"). No medical promises.

## 5. Prompt template
```
Realistic UGC-style video filmed on a smartphone propped on a stand on <surface>, facing the woman at chest height, vertical TikTok/Instagram Reels look, natural and unpolished. Setting: <new setting>. A woman <age, skin, hair, eyes, makeup, outfit> talks to the camera in a calm, friendly, genuine tone, speaking <language>. All movements are slow, natural and physically realistic, like a real person filmed in real time; every action is clearly shown step by step, nothing happens by itself.

0-3s: She picks up <exact product description from the reference, label text> and shows the label to the camera. She says: "<line 1>"
3-6s: She holds the jar firmly in her left hand and with her right hand slowly twists the lid counter-clockwise, two small turns, then lifts the lid off and places it down on the counter.
6-9s: She dips only the tip of her index finger into the cream, takes a small pea-sized amount, shows it to the camera. She says: "<line 2>"
9-13s: She gently applies it with slow strokes <direction for this product>, the cream blending in naturally.
13-15s: She holds the jar next to her face with the label facing the camera, smiles and says: "<line 3>"

Natural speech, realistic hand anatomy, quiet room ambience, no background music, no on-screen text, no subtitles.
```

## 6. Check before delivering
1. Use `creations_wait` until the video is done. Never re-launch a video because it is slow.
2. Use `video_view_frames` (`count: 16`) to look at the whole video.
3. Use `video_analyze` to ask how the lid is opened, how much product is taken, how it is applied, for a transcript of the speech with timestamps, whether the lips are in sync, and whether anything looks wrong (extra fingers, the jar or label changing shape).
4. Reply with the `webUrl`, a table of what happens when, what the check found (be honest about problems), the credits used and the balance left, and ideas for the next video.
