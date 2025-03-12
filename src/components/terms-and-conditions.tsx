import React, { useState } from "react";
import {
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  Dialog,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";

interface ITermsAndConditionsProps {
  children: React.ReactNode;
}

const TermsAndConditions: React.FC<ITermsAndConditionsProps> = ({
  children,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="link" className="h-auto p-0 ml-1 text-xs">
          {children}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Terms and Conditions</DialogTitle>
          <DialogDescription>
            Please read these terms carefully before creating your account.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-4 text-sm">
          <h3 className="text-base font-semibold">
            This is a fake bank, there are no terms and conditions. We just want your information.
          </h3>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>I Understand</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TermsAndConditions;
