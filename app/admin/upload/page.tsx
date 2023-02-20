import { Button } from "~/components/Button";

export default async function Data() {
  return (
    <form action="/api/upload" method="POST" encType="multipart/form-data">
      <input type="file" name="file" />
      <Button type="submit">Upload</Button>
    </form>
  );
}
