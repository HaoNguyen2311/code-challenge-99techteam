"use client";
import { useState } from "react";

const Solution1 = () => {
  const [value, setValue] = useState(1);
  var sum_to_n_a = function (n: number) {
    return (n * (n + 1)) / 2;
  };

  var sum_to_n_b = function (n: number) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
      sum += i;
    }
    return sum;
  };

  var sum_to_n_c = function (n: number): number {
    if (n === 0) return 0;
    return n + sum_to_n_c(n - 1);
  };

  return (
    <div className="mx-28 mt-12">
      <input
        defaultValue={1}
        className="border border-black rounded"
        type="number"
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <div className="flex flex-col gap-2 mt-6">
        <p> Solution 1: {sum_to_n_a(value)}</p>
        <p> Solution 2: {sum_to_n_b(value)}</p>
        <p> Solution 3: {sum_to_n_c(value)}</p>
      </div>
    </div>
  );
};

export default Solution1;
