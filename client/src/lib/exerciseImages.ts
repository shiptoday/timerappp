// Exercise images mapping - using local backup images
import bandedShoulderDislocatesImg from '@assets/banded_shoulder_dislocates_1753204130270.jpg';
import adhoMukhaImg from '@assets/adho_mukha_svanasana_dog_1753204130270.jpg';
import catCowImg from '@assets/cat_cow_1753204130270.jpg';
import wristPulsesImg from '@assets/wrist_pulses_front_back_on_floor_1753204130270.jpg';
import quadrupedHipCarsImg from '@assets/quadruped_hip_cars_1753204130269.jpg';
import hipThrustImg from '@assets/hip_thrust_arch_1753204130270.jpg';
import upavishthaImg from '@assets/upavistha_konasana_forward_seated_fold_open_legs_1753204130270.png';
import halasanaImg from '@assets/halasana_knees_to_floor_1753204130270.png';
import garlandSquatImg from '@assets/garland_squat_1753204130270.jpg';
import pigeonFrogImg from '@assets/pigeon_pose_frog_1753204130270.jpg';
import activeBarHangImg from '@assets/active_bar_hang_1753204130270.jpg';

export const exerciseImages: Record<string, string> = {
  // Mobility exercises
  "Banded shoulder dislocates": bandedShoulderDislocatesImg,
  "Adho mukha svanasana (Downward Dog)": adhoMukhaImg,
  "Cat–Cow": catCowImg,
  "Wrist pulses (front/back on floor)": wristPulsesImg,
  "Quadruped Hip CAR's": quadrupedHipCarsImg,
  "Hip thrust + Arch": hipThrustImg,
  "Upavistha konasana": upavishthaImg,
  "Halasana (Knees to floor)": halasanaImg,
  "Garland squat": garlandSquatImg,
  "Pigeon pose + Frog": pigeonFrogImg,
  "Active bar hang": activeBarHangImg
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