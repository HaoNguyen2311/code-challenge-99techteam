import { ReactNode } from "react";
import useWalletBalances from "path-to-hooks/useWalletBalances";
import usePrices from "path-to-hooks/usePrices";
import WalletRow from "path-to-components/WalletRow";

// interface WalletBalance {
//   currency: string;
//   amount: number;
// }
// interface FormattedWalletBalance {
//   currency: string;
//   amount: number;
//   formatted: string;
// }

// WalletBalance and FormattedWalletBalance are almost identical,
// which introduces unnecessary repetition in type definitions.

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props {
  children: ReactNode;
}

const BLOCKCHAIN_PRIORITY: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // const getPriority = (blockchain: any): number => {
  //   switch (blockchain) {
  //     case 'Osmosis':
  //       return 100
  //     case 'Ethereum':
  //       return 50
  //     case 'Arbitrum':
  //       return 30
  //     case 'Zilliqa':
  //       return 20
  //     case 'Neo':
  //       return 20
  //     default:
  //       return -99
  //   }
  // }

  // Hash map lookup (BLOCKCHAIN_PRIORITY[blockchain]) is faster than a switch statement,
  // especially as the number of possible blockchains grows.
  const getPriority = (blockchain: string): number =>
    BLOCKCHAIN_PRIORITY[blockchain] || -99;

  // const sortedBalances = useMemo(() => {
  //   return balances.filter((balance: WalletBalance) => {
  // 	  const balancePriority = getPriority(balance.blockchain);
  // 	  if (lhsPriority > -99) {
  // 	     if (balance.amount <= 0) {
  // 	       return true;
  // 	     }
  // 	  }
  // 	  return false
  // 	}).sort((lhs: WalletBalance, rhs: WalletBalance) => {
  // 		const leftPriority = getPriority(lhs.blockchain);
  // 	  const rightPriority = getPriority(rhs.blockchain);
  // 	  if (leftPriority > rightPriority) {
  // 	    return -1;
  // 	  } else if (rightPriority > leftPriority) {
  // 	    return 1;
  // 	  }
  //   });
  // }, [balances, prices]);

  // const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  //   return {
  //     ...balance,
  //     formatted: balance.amount.toFixed()
  //   }
  // })

  // The code performs two .map() operations on the same data (sortedBalances)
  // — one for formatting and another for rendering.
  // This is inefficient because each .map() method iterates over the array,
  // leading to unnecessary passes.

  //Fix: Combine filtering, sorting, and formatting into a single map() operation to minimize array traversals.
  const sortedAndFormattedBalances = balances
    .filter(
      (balance: WalletBalance) =>
        getPriority(balance.blockchain) > -99 && balance.amount > 0
    )
    .sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const lhsPriority = getPriority(lhs.blockchain);
      const rhsPriority = getPriority(rhs.blockchain);
      return rhsPriority - lhsPriority;
    })
    .map((balance: WalletBalance) => ({
      ...balance,
      formatted: balance.amount.toFixed(2), // Format the amount to 2 decimal places
    }));

  // const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  const rows = sortedAndFormattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className="row-class"
          // key={index}
          // Using index as the key for React components can lead to performance issues if the list order changes.
          // It causes unnecessary re-renders and incorrect behavior.
          key={balance.currency + balance.blockchain}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
