// @ts-nocheck
"use client"
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { classifyMail, getEmails } from "@/lib/actions";
import React, { useEffect, useState } from 'react';


import { clasifyMerge } from "@/lib/helper";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { ClassifiedEmail, Email } from "@/lib/types";

import SetApiKeyDialog from "@/components/DrawerForKey";
import { signIn, useSession } from "next-auth/react";
type errorType = { emails: never[]; error?: undefined; }
type errorType2 = { error: string; emails?: undefined; }
export default function Home() {
  const [emails, setEmails] = useState<any>([]);
  const [number, setNumber] = useState("10");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const apiKey = window.localStorage.getItem('openai-api-key');
  const {data,status} = useSession()

  useEffect(() => {
    if (status === 'unauthenticated') {
      signIn(); 
    }
  }, [status]);
  const fetchEmails = async () => {
    setLoading(true);
    setError(null);
    try {

      const res = await getEmails(number);
  
      setEmails(res);
      toast("fetched emails...")
    } catch (err) {
      setError('Failed to fetch emails');
      toast('Failed to fetch emails')
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {

    fetchEmails();
  }, [number]);
  const handleClassify = async () => {
    if (!apiKey) {
      toast("no api key found")
      return;
    }
    try {
      setLoading(true);
      toast("wait till magic happens!")
      if(emails ==null )  return;
      const newMails = emails.map((email:any) => email.subject);
      const response = await classifyMail(newMails, apiKey);
      if (!response) {
        toast("No response from OpenAI");
        return
      }
      const parsedResponse = JSON.parse(response);
      const res = clasifyMerge(emails, parsedResponse);
      setEmails(res);
      toast("emails! classified")
    } catch (error) {
      console.error("Error classifying emails:", error);
      toast("Failed to classify check api key")
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="flex min-h-screen flex-col gap-2  p-10">
      <div className="flex justify-between">
        <Select onValueChange={setNumber} defaultValue={number}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a number of emails to display" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="15">15</SelectItem>
            <SelectItem value="20">20</SelectItem>
          </SelectContent>
        </Select>

        {
          apiKey ? (<Button onClick={handleClassify}>
            {loading ? "Loading..." : "Clasify"}
          </Button>) : (<SetApiKeyDialog />)
        }






      </div>

      <h1 className="text-2xl font-bold mb-4">Inbox</h1>

      {loading && <div>Loading emails...</div>}
      {error && <div className="text-red-500">{error}</div>}
      {!loading && !error && <EmailList emails={emails} />}
    </main>
  );
}






const EmailList = ({ emails }: { emails: Email[] }) => {
  return (
    <div className="max-w-4xl p-2">
      <ul className="space-y-4">
        {emails.length > 0 && emails.map((email: any, index: number) => (
          <li key={index}>
            <Drawer>
              <DrawerTrigger className="font-bold">
                <div className="flex-col items-start border-b text-start p-2 justify-start gap-2">
                  <div className="flex gap-2">
                    {email.subject}
                    <div>
                      {'classification' in email && email.classification && (
                        <Badge>
                          {email.classification}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="font-extralight text-sm">{email.from}</div>
                </div>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>
                    <div className="flex-col items-start border-b text-start p-2 justify-start gap-2">
                      <div className="flex items-center gap-2">
                        {email.subject}
                        {'classification' in email && email.classification && (
                          <Badge>
                            {email.classification}
                          </Badge>
                        )}
                      </div>
                      <div className="font-extralight text-sm">{email.date}</div>
                    </div>
                  </DrawerTitle>
                  <DrawerDescription>
                    <div style={{ overflowY: "scroll", maxHeight: "400px" }}>
                      <div dangerouslySetInnerHTML={{ __html: email.emailBody }}></div>
                    </div>
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </li>
        ))}
      </ul>
    </div>
  );
};



