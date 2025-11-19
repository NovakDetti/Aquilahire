import { Suspense } from "react";
import NewInterviewClient from "./NewInterviewClient";

export default function NewInterviewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-10 text-center text-muted-foreground">
          Interjú űrlap betöltése...
        </div>
      }
    >
      <NewInterviewClient />
    </Suspense>
  );
}
