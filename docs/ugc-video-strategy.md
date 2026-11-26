# UGC video strategy (TIRGAZEA)

Approved style for AI UGC product videos (first used on the Tighten & Lift Neck Cream, Nov 2026).

## Tooling
- Freepik / Magnific, model **Seedance 2.5** (`bytedance-seedance-pro-2.5`).
- **9:16 vertical, 720p, 15 s**, native audio on, **no music**, no on-screen text or subtitles.
- Always pass the real product photos from the store page as references (`product` = main packshot, `image` = open jar / texture shot) so the jar and label match the real product.
- Cost: about 6,600 credits per 15 s 720p video. Freepik asks for an explicit "yes" before each generation.

## Realism rules (the key point)
- Every action is physical and shown step by step. Nothing moves by itself: no flying lids, no cream appearing on the skin.
- The phone sits on a **stand** facing the creator (not a selfie), so both hands are free:
  - she holds the jar in one hand and **twists the lid off with the other**, then sets the lid down on the counter;
  - she takes a **small, pea-sized amount** with her fingertip and shows it to the camera;
  - she **applies it gently**, with slow upward strokes (neck: from the base toward the jaw).
- State this in the prompt: "slow, natural, physically realistic movements, like a real person filmed in real time; nothing happens by itself; realistic hand anatomy".
- Show the label to the camera at the start and at the end (jar held next to her face).

## Variety
- Use a **new face and a new setting** for each video (e.g. bathroom vanity, bedroom, dressing table), so ads can be A/B tested.
- Short, genuine lines spaced across the 15 s (3 lines is about right). Keep claims to what the product page says (e.g. "smoother", "firmer-looking", "hydrated").

## Check before delivering
- Use `video_view_frames` and `video_analyze`: check the lid and hand physics, fingers, jar/label morphing, the speech transcript and lip sync.
