export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
export const asset = (path: string) => `${basePath}${path}`;
export const restaurant = {
  name: "Proof Pizza Bar & Cafe",
  phone: "+855 12 345 678",
  phoneHref: "tel:+85512345678",
  maps: "https://maps.app.goo.gl/fP6T5GmEshLWcUf78",
  instagram: "https://www.instagram.com/proofpizzabar/",
  facebook: "https://www.facebook.com/proofpizzabar/",
};
