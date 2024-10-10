import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { ReactNode } from "react";

export default function SheetComponent({
  children,
  triggerComponent = <Button variant="outline">Open</Button>,
  headerTitle = "Edit profile",
  description,
}: {
  children: ReactNode;
  triggerComponent?: ReactNode;
  headerTitle?: string;
  description?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{triggerComponent}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{headerTitle}</SheetTitle>
          <SheetDescription>
           {description}
          </SheetDescription>
        </SheetHeader>
        {children}
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
