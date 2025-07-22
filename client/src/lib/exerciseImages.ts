// Exercise images mapping - using reliable image sources
export const exerciseImages: Record<string, string> = {
  // Mobility exercises
  "Banded shoulder dislocates": "https://www.bodybuilding.com/images/2016/april/band-shoulder-dislocate-1.jpg",
  "Adho mukha svanasana (Downward Dog)": "https://www.verywellfit.com/thmb/zJNMUYnhCgMJy_Vd9z3rH-0aO7w=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Downward-Facing-Dog-56a2b5b15f9b58b7d0d0e8f3.jpg",
  "Cat–Cow": "https://www.yogajournal.com/.image/t_share/MTQ2MTgwNzU5MDk4NTkyMzEx/cat-cow-pose.jpg",
  "Wrist pulses (front/back on floor)": "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Ctext x='100' y='100' text-anchor='middle' dy='.3em' fill='%23374151' font-size='14'%3EWrist Pulses%3C/text%3E%3C/svg%3E",
  "Quadruped Hip CAR's": "https://www.acefitness.org/getmedia/64b3f3b6-e6a1-4c1f-b3b1-4e3b3d2d2e98/ACE-Hip-CARs.jpg",
  "Hip thrust + Arch": "https://www.acefitness.org/getmedia/16c3d8d7-0c3e-4b2d-a8f3-1e8d6c3e5a7f/Hip-Thrust-1.jpg",
  "Upavistha konasana": "https://www.yogajournal.com/.image/t_share/MTQ2MTgwODYyNTMxNjEyOTUz/wide-legged-seated-forward-bend.jpg",
  "Halasana (Knees to floor)": "https://www.yogajournal.com/.image/t_share/MTQ2MTgwODYyMTU3NzI5MjE3/plow-pose.jpg",
  "Garland squat": "https://www.yogajournal.com/.image/t_share/MTQ2MTgwODYyNTQ5MjkzNzE5/garland-pose.jpg",
  "Pigeon pose + Frog": "https://www.yogajournal.com/.image/t_share/MTQ2MTgwODYyMTU3Njk3MTg5/pigeon-pose.jpg",
  "Active bar hang": "https://www.verywellfit.com/thmb/j8u3vZ3ZgLyXFoLfK0pQdV2V6a8=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/hanging-exercise-5b8d8d64c9e77c005b3a8d4e.jpg"
};

export const getExerciseImage = (exerciseName: string): string | undefined => {
  console.log('Looking for image for exercise:', exerciseName);
  
  // Direct match first
  if (exerciseImages[exerciseName]) {
    console.log('Found direct match');
    return exerciseImages[exerciseName];
  }
  
  // Specific mappings for actual exercise names in the app
  const exerciseMappings: Record<string, string> = {
    "Banded Shoulder Dislocates": exerciseImages["Banded shoulder dislocates"],
    "Downward Dog": exerciseImages["Adho mukha svanasana (Downward Dog)"],
    "Cat-Cow": exerciseImages["Cat–Cow"],
    "Wrist Pulses (Front/Back)": exerciseImages["Wrist pulses (front/back on floor)"],
    "Quadruped Hip CARs": exerciseImages["Quadruped Hip CAR's"],
    "Hip Thrust + Arch": exerciseImages["Hip thrust + Arch"],
    "Seated Wide-Leg Forward Fold": exerciseImages["Upavistha konasana"],
    "Plow Pose": exerciseImages["Halasana (Knees to floor)"],
    "Garland Squat": exerciseImages["Garland squat"],
    "Pigeon + Frog (30s each)": exerciseImages["Pigeon pose + Frog"],
    "Active Bar Hang": exerciseImages["Active bar hang"]
  };

  if (exerciseMappings[exerciseName]) {
    console.log('Found mapping match');
    return exerciseMappings[exerciseName];
  }
  
  // Fuzzy match fallback - check if exercise name contains key words
  const normalizedName = exerciseName.toLowerCase();
  
  for (const [imageName, url] of Object.entries(exerciseImages)) {
    const normalizedImageName = imageName.toLowerCase();
    
    // Check for partial matches
    if (normalizedName.includes('shoulder') && normalizedImageName.includes('shoulder')) {
      return url;
    }
    if (normalizedName.includes('downward') && normalizedImageName.includes('downward')) {
      return url;
    }
    if (normalizedName.includes('cat') && normalizedImageName.includes('cat')) {
      return url;
    }
    if (normalizedName.includes('wrist') && normalizedImageName.includes('wrist')) {
      return url;
    }
    if ((normalizedName.includes('hip') || normalizedName.includes('thrust')) && normalizedImageName.includes('hip')) {
      return url;
    }
    if (normalizedName.includes('squat') && normalizedImageName.includes('squat')) {
      return url;
    }
    if (normalizedName.includes('pigeon') && normalizedImageName.includes('pigeon')) {
      return url;
    }
    if (normalizedName.includes('hang') && normalizedImageName.includes('hang')) {
      return url;
    }
  }
  
  return undefined;
};