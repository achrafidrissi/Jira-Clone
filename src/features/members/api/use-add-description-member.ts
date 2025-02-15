import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  typeof client.api.members["add-description-member"][":memberId"]["$post"],
  200
>;
type RequestType = InferRequestType<
  typeof client.api.members["add-description-member"][":memberId"]["$post"]
>;

export const useAddDescriptionMember = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members["add-description-member"][":memberId"]["$post"]({
        param,
        json,
      });
      if (!response.ok) {
        throw new Error("Failed to add description");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Description added");
      queryClient.invalidateQueries({ queryKey: ["members"] });
    },
    onError: () => {
      toast.error("Failed to add description");
    },
  });
  return mutation;
};
