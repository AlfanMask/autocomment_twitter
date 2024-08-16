export default function isBetween9AMAnd9PM() {
    const now = new Date();
    const hour = now.getHours();
  
    return hour >= 9 && hour < 21;
}