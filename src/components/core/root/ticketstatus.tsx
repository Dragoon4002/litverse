"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useActiveAccount } from "thirdweb/react";
import { contract } from "@/lib/client-thirdweb";
import {
  prepareContractCall,
  readContract,
  sendTransaction,
  toWei,
} from "thirdweb";
import { toast } from "@/hooks/use-toast";

import Link from "next/link";
import { ToastAction } from "@/components/ui/toast";

export function TicketStatus({ id, value }: { id: string; value: Number }) {
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const account = useActiveAccount();

  const onRegister = async () => {
    try {
      if (account) {
        setIsLoading(true);
        const transaction = await prepareContractCall({
          contract,
          method: "function mintTicket(string eventId) payable",
          params: [id],
          value: toWei(value.toString()),
        });

        console.log(transaction);

        const { transactionHash } = await sendTransaction({
          transaction,
          account,
        });

        if (transactionHash) {
          toast({
            title: "Ticket Minted Succesfully",
            description: "You are officially appearing for this event",
            action: (
              <ToastAction altText={"transactionHash"}>
                <Link
                  href={`https://testnet.bscscan.com/tx/${transactionHash}`}
                  target="_blank"
                >
                  View
                </Link>
              </ToastAction>
            ),
          });

          setIsRegistered(true);
        }
      }
    } catch (err: any) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err?.message || "Failed to mint ticket",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkRegistered = async () => {
    try {
      if (account) {
        setIsLoading(true);
        const data = await readContract({
          contract,
          method:
            "function hasTicket(address user, string eventId) view returns (bool)",
          params: [account.address, id],
        });
        if (data) {
          setIsRegistered(true);
        }
      }
    } catch (err) {
      console.log(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to check registration",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      checkRegistered();
    }
  }, [account]);

  if (isRegistered) {
    return (
      <div className="bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 p-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <Check className="w-5 h-5 mr-2" />
          <span>You're registered for this event</span>
        </div>
      </div>
    );
  }

  return (
    <Button
      disabled={!account || isLoading}
      size="lg"
      className="w-full"
      onClick={onRegister}
    >
      Register Now
    </Button>
  );
}
