'use client'

import {Button} from "@/components/ui/button";
import {useNewAccount} from "@/features/hooks/use-new-account";
import {useGetAccounts} from "@/features/accounts/api/use-get-accounts";



export default function Home() {

const { onOpen } = useNewAccount()

  return (
      <div>
        <Button onClick={onOpen}>
            Add an account
        </Button>
      </div>
  );
}
