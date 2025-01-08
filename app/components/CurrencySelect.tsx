"use client";

import { useCallback, useState } from "react";
import { AutoComplete, Input, Select, Space, Image } from "antd";

import { getCurrencyImageUrl } from "../utils/image";
import { CurrencyData } from "../services/currency";

type CurrencySelectProps = {
  currencyList: CurrencyData[];
  name: string;
  onChange: (value: string, name: string) => void;
};

const CurrencySelect = ({
  currencyList,
  name,
  onChange,
}: CurrencySelectProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<string>();
  const [selectedToken, setSelectedToken] = useState<string>();
  const [tokenOptionList, setTokenOptionList] = useState<any[]>([]);

  const onSearch = useCallback(
    (value: string) => {
      setSelectedCurrency(value);
      const filteredOptions = currencyList
        .filter((currency) =>
          currency.currency.toLowerCase().includes(value.toLowerCase())
        )
        .map((currency) => ({
          value: currency.currency,
          label: (
            <div className="flex justify-between p-2">
              <span>{currency.currency}</span>
              <span>{currency.price.toFixed(2)}</span>
            </div>
          ),
        }));
      setTokenOptionList(filteredOptions);
    },
    [currencyList]
  );

  const onSelect = useCallback(
    (value: string) => {
      setSelectedCurrency(value);
      setSelectedToken(value);
      onChange(value, name);
    },
    [name, onChange]
  );

  const onBlur = useCallback(() => {
    if (currencyList.some((cur) => cur.currency === selectedCurrency)) {
      return;
    }
    setSelectedCurrency(selectedToken);
  }, [currencyList, selectedCurrency]);

  return (
    <Space.Compact size="large" className="w-full">
      <Select className="!w-[40%]" onSelect={onSelect} value={selectedToken}>
        {currencyList.map((curr) => {
          return (
            <Select.Option key={curr.currency} value={curr.currency}>
              <div className="flex justify-center items-center">
                <Image
                  preview={false}
                  src={getCurrencyImageUrl(curr.currency)}
                  alt={`${curr.currency}`}
                  loading="lazy"
                />
              </div>
            </Select.Option>
          );
        })}
      </Select>
      <AutoComplete
        onBlur={onBlur}
        onSelect={onSelect}
        value={selectedCurrency}
        onSearch={onSearch}
        options={tokenOptionList}
        placeholder="Search for a currency"
        className="w-full"
      >
        <Input className="border border-gray-300 rounded-md" />
      </AutoComplete>
    </Space.Compact>
  );
};

export default CurrencySelect;
