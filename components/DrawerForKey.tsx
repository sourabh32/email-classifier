import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { DrawerClose } from './ui/drawer';
import { Button } from './ui/button';
import { toast } from 'sonner';

const SetApiKeyDialog: React.FC = () => {
  const [apiKey, setApiKey] = useState<string>('');

  const handleSaveApiKey = () => {
    localStorage.setItem('openai-api-key', apiKey);
    toast('API key saved to localStorage');
    window.location.reload()
  };

  return (
    <Dialog>
      <DialogTrigger>Set Key</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set API Key</DialogTitle>
          <DialogDescription>
            Enter your API key below to save it to localStorage.
          </DialogDescription>
        </DialogHeader>
        <div className="p-4">
          <Input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter API key"
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleSaveApiKey}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Save API Key
          </Button>
          <DrawerClose>
            Close
          </DrawerClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SetApiKeyDialog;
