"use client";

import { useState, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftIcon, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";
import { useWorkspaceId } from "../hooks/use-workspace-id";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useAddDescriptionMember } from "@/features/members/api/use-add-description-member";
import { useConfirm } from "@/hooks/use-confirm";
import { MemberRole } from "@/features/members/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const MembersList = () => {
  const workspaceId = useWorkspaceId();
  const [ConfirmDialog, confirm] = useConfirm(
    "Remove member",
    "This member will be removed from the workspace",
    "destructive"
  );

  const { data } = useGetMembers({ workspaceId });

  const { mutate: deleteMember, isPending: isDeletingMember } = useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember();
  const { mutate: addDescription, isPending: isAddingDescription } = useAddDescriptionMember();

  // State for the Add Description dialog
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [descriptionText, setDescriptionText] = useState("");

  const handleUpdateMember = (memberId: string, role: MemberRole) => {
    updateMember({
      json: { role },
      param: { memberId },
    });
  };

  const handleDeleteMember = async (memberId: string) => {
    const ok = await confirm();
    if (!ok) return;

    deleteMember(
      { param: { memberId } },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  // Open the Add Description dialog
  const openAddDescriptionDialog = (memberId: string) => {
    setSelectedMemberId(memberId);
    setOpenDescriptionDialog(true);
  };

  // Handle submission of the description via the modal
  const handleAddDescriptionSubmit = () => {
    if (!descriptionText.trim() || !selectedMemberId) return;
    addDescription({
      param: { memberId: selectedMemberId },
      json: { description: descriptionText },
    });
    setOpenDescriptionDialog(false);
    setDescriptionText("");
    setSelectedMemberId(null);
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <ConfirmDialog />
      <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
        <Button asChild variant="secondary" size="sm">
          <Link href={`/workspaces/${workspaceId}`}>
            <ArrowLeftIcon className="size-4 mr-2" />
            Back
          </Link>
        </Button>
        <CardTitle className="text-xl font-bold">Members list</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>

      <CardContent className="p-7">
        {data?.documents.map((member, index) => (
          <Fragment key={member.$id}>
            <div className="flex items-center gap-2">
              <MemberAvatar
                className="size-10"
                fallbackClassName="text-lg"
                name={member.name}
              />
              <div className="flex flex-col">
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="ml-auto" variant="secondary" size="icon">
                    <MoreVerticalIcon className="size-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdateMember(member.$id, MemberRole.ADMIN)}
                    disabled={isUpdatingMember}
                  >
                    Set as Administrator
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => handleUpdateMember(member.$id, MemberRole.MEMBER)}
                    disabled={isUpdatingMember}
                  >
                    Set as Member
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium"
                    onClick={() => openAddDescriptionDialog(member.$id)}
                    disabled={isAddingDescription}
                  >
                    Add a description
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="font-medium text-amber-700"
                    onClick={() => handleDeleteMember(member.$id)}
                    disabled={isDeletingMember}
                  >
                    Remove {member.name}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            {index < data.documents.length - 1 && <Separator className="my-2.5" />}
          </Fragment>
        ))}
      </CardContent>

      {/* Custom Dialog for Adding Description */}
      <Dialog open={openDescriptionDialog} onOpenChange={setOpenDescriptionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Description</DialogTitle>
            <DialogDescription>
              Enter a description for the selected member.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Description"
              value={descriptionText}
              onChange={(e) => setDescriptionText(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>
          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setOpenDescriptionDialog(false);
                setDescriptionText("");
                setSelectedMemberId(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddDescriptionSubmit} disabled={isAddingDescription}>
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};
