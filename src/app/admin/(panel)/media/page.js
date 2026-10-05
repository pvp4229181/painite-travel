import MediaLibrary from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/AdminTable";
import { isMediaConfigured } from "@/lib/cloudinary";

export const metadata = { title: "Media" };

export default function MediaAdmin() {
  return (
    <>
      <PageHeader
        title="Media"
        description="Images and videos uploaded for the website. Choose them in any image or video field when editing content."
      />
      <MediaLibrary configured={isMediaConfigured()} />
    </>
  );
}
