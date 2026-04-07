import connectToDatabase from "@/lib/db";
import Website from "@/models/Website";
import { notFound } from "next/navigation";

export default async function PublicWebsitePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  await connectToDatabase();
  const website = await Website.findOne({ slug });

  if (!website) {
    notFound();
  }

  // We simply return the stored HTML. 
  // Next.js will render this as the page content.
  // We use dangerousSetInnerHTML but since it's a dedicated page for the user's site, this is the intended behavior.
  
  return (
    <div 
      className="min-h-screen w-full"
      dangerouslySetInnerHTML={{ __html: website.html }} 
    />
  );
}
