"use client";

import React, { useEffect, useState } from "react";
import { Form, Input } from "antd";

import { CurrencyData, getCurrencyData } from "../services/currency";
import CurrencySelect from "../components/CurrencySelect";
import Notification, { NotificationRef } from "../components/Notification";

const CurrencySwapForm = () => {
  const [currencyList, setCurrencyList] = useState<CurrencyData[]>([]);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>();

  const [form] = Form.useForm();

  const notificationRef = React.useRef<NotificationRef>(null);

  useEffect(() => {
    const fetchCurrency = async () => {
      try {
        const data = await getCurrencyData();

        const latestExchangeRateList = new Map<string, CurrencyData>();

        data?.forEach((data) => {
          if (
            !latestExchangeRateList.has(data.currency) ||
            new Date(data.date) >
              new Date(latestExchangeRateList.get(data.currency)?.date || "")
          ) {
            latestExchangeRateList.set(data.currency, data);
          }
        });

        const generatedExchangeRates = Object.fromEntries(
          Array.from(latestExchangeRateList.entries()).map(([key, value]) => [
            key,
            value.price,
          ])
        );
        setExchangeRates(generatedExchangeRates);

        const generatedCurrencyList = Array.from(
          latestExchangeRateList.values()
        );
        setCurrencyList(generatedCurrencyList);
      } catch (error) {
        console.log(error);
        notificationRef.current?.showNotification(
          "An error occur when trying to fetch data"
        );
      }
    };

    fetchCurrency();
  }, []);

  const updateConvertedAmount = (newAmount: number) => {
    const formValues = form.getFieldsValue();
    const { fromCurrency, toCurrency } = formValues;

    if (
      fromCurrency &&
      toCurrency &&
      exchangeRates?.[fromCurrency] &&
      exchangeRates[toCurrency]
    ) {
      const rateFrom = exchangeRates[fromCurrency];
      const rateTo = exchangeRates[toCurrency];
      const newConvertedAmount = (newAmount * rateTo) / rateFrom;
      form.setFieldValue("convertedAmount", newConvertedAmount);
    }
  };

  const onCurrencyChange = (currency: string, name: string) => {
    form.setFieldsValue({ [name]: currency });
  };

  const onFormFinish = (values: any) => {
    const { amount } = values;
    if (amount) {
      updateConvertedAmount(amount);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg mt-20">
      <h2 className="text-2xl font-semibold text-center mb-4">Currency Swap</h2>
      <Notification ref={notificationRef} message="" />
      <Form form={form} layout="vertical" onFinish={onFormFinish}>
        <Form.Item
          label="From Currency"
          name="fromCurrency"
          rules={[{ required: true, message: "Please select a currency" }]}
        >
          <CurrencySelect
            name="fromCurrency"
            onChange={(value) => onCurrencyChange(value, "fromCurrency")}
            currencyList={currencyList}
          />
        </Form.Item>

        <Form.Item
          label="To Currency"
          name="toCurrency"
          rules={[{ required: true, message: "Please select a currency" }]}
        >
          <CurrencySelect
            name="toCurrency"
            onChange={(value) => onCurrencyChange(value, "toCurrency")}
            currencyList={currencyList}
          />
        </Form.Item>

        <Form.Item
          label="Amount"
          name="amount"
          rules={[{ required: true, message: "Please enter an amount" }]}
        >
          <Input
            size="large"
            type="number"
            placeholder="Enter amount"
            className="border border-gray-300 rounded-md"
          />
        </Form.Item>

        <Form.Item name="convertedAmount" label="Converted Amount">
          <Input
            disabled
            className="!text-black"
            type="text"
            readOnly
            size="large"
          />
        </Form.Item>
        <button
          type="submit"
          className="w-full border border-black rounded p-2"
        >
          Swap
        </button>
      </Form>
    </div>
  );
};

export default CurrencySwapForm;
