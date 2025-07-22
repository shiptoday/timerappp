// Exercise images mapping
export const exerciseImages: Record<string, string> = {
  // Mobility exercises
  "Banded shoulder dislocates": "https://cdn.muscleandstrength.com/sites/default/files/banded-shoulder-dislocates-0.jpg",
  "Adho mukha svanasana (Downward Dog)": "https://www.gaia.com/wp-content/uploads/article-migration-image-1920x1080_DownwardFacingDogPose-768x432.jpg",
  "Cat–Cow": "https://www.fitsri.com/wp-content/uploads/2020/12/Cat-cow-pose-1024x683.jpg",
  "Wrist pulses (front/back on floor)": "https://stretchtimer.com/assets/stretch/wrist_extension.png",
  "Quadruped Hip CAR's": "https://s3assets.skimble.com/assets/1756691/image_iphone.jpg",
  "Hip thrust + Arch": "https://www.verywellfit.com/thmb/oDkDB357vw0gH1HV3IvvYu86gAI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/hip-thrust-exercise--1199620482-e1e7b0f530a2477487fc0006e45fd7c9.jpg",
  "Upavistha konasana": "https://omstars.com/blog/wp-content/uploads/2022/06/Upavistha-Konasana.png",
  "Halasana (Knees to floor)": "https://fitsri.com/wp-content/uploads/2020/03/plow-pose.jpg",
  "Garland squat": "https://media.yogauonline.com/app/uploads/2019/10/06054609/garland-2.webp",
  "Pigeon pose + Frog": "https://i.pinimg.com/736x/86/b5/46/86b546d3285ad6048d77177d2a5b5f05.jpg",
  "Active bar hang": "https://www.inspireusafoundation.org/wp-content/cache/flying-press/www.inspireusafoundation.org/-cgqmqDbExE-hqdefault.jpg"
};

export const getExerciseImage = (exerciseName: string): string | undefined => {
  // Direct match first
  if (exerciseImages[exerciseName]) {
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