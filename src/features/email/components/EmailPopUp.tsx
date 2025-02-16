import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface EmailPopupProps {
  productOwnerEmail: string;
  productOwnerName: string;
  projectTopic: string;
  projectMessage?: string;
}

const EmailPopup: React.FC<EmailPopupProps> = ({
  productOwnerEmail,
  productOwnerName,
  projectTopic,
  projectMessage = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState(projectMessage);
  const [topic, setTopic] = useState(projectTopic);
  const [isSending, setIsSending] = useState(false);

  const sendEmail = async () => {
    try {
      setIsSending(true);
      
      const response = await fetch('http://localhost:3000/api/email', {
        method: 'POST',
        credentials: 'include', // Add this line
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productOwnerEmail,
          topic,
          message,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send email');
      }

      toast.success("Email Sent", {
        description: `Your message has been sent to ${productOwnerName}`,
      });
      setIsOpen(false);
      setMessage(projectMessage);
      setTopic(projectTopic);
    } catch (error: any) {
      toast.error("Failed to send email", {
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="bg-blue-600 hover:bg-blue-700">
        Contact Product Owner
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send Email to Product Owner</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">To:</label>
              <Input 
                value={`${productOwnerName} (${productOwnerEmail})`}
                disabled
                className="bg-gray-50"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic:</label>
              <Input 
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter the topic..."
                className="bg-gray-50"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message:</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="h-32"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={sendEmail}
              disabled={!message.trim() || isSending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmailPopup;