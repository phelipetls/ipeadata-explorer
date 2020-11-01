import React, { useState } from "react";

import { useQuery } from "react-query";

import { ChartBar } from "./ChartBar";
import { ChartSection } from "./ChartSection";
import { ChartForm } from "./ChartForm";
import { ChartFormDate } from "./ChartFormDate";
import { ChartWrapper } from "./ChartWrapper";

import { limitByDate, buildMetadataUrl } from "../api/odata";
import { formatDateFromDatePicker, subtractSeriesMaxDate } from "../api/utils";

const DEFAULT_LIMIT = 0;

const CATEGORY_COUNT_QUERY =
  "groupby((VALVALOR),aggregate($count as totalCount))&$orderby=totalCount desc";

const parseJsonCount = json =>
  json.reduce(
    (acc, category) => ({
      ...acc,
      [category.VALVALOR]: category.totalCount,
    }),
    {}
  );

export function ChartCategorical({ code, metadata }) {
  const [initialDate, setInitialDate] = useState(null);
  const [finalDate, setFinalDate] = useState(null);
  const [lastN, setLastN] = useState(DEFAULT_LIMIT);

  const { isLoading, data } = useQuery(
    [code, initialDate, finalDate, lastN],
    async (code, initialDate, finalDate, lastN) => {
      let dateFilter = "";

      if (initialDate || finalDate) {
        const initialDateValue = formatDateFromDatePicker(initialDate);
        const finalDateValue = formatDateFromDatePicker(finalDate);

        dateFilter = limitByDate(initialDateValue, finalDateValue);
      } else {
        dateFilter = limitByDate(
          subtractSeriesMaxDate({
            metadata: metadata,
            offset: lastN,
          })
        );
      }

      const url =
        buildMetadataUrl(code) +
        `/ValoresStr?$apply=filter(${dateFilter})/${CATEGORY_COUNT_QUERY}`;

      return await (await fetch(url)).json();
    }
  );

  const categoriesCount = parseJsonCount(data?.value || []);

  const labels = Object.keys(categoriesCount);
  const datasets = [
    {
      label: metadata.UNINOME,
      data: Object.values(categoriesCount),
    },
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    let { initialDate, finalDate, lastN } = e.target.elements;

    if (initialDate) setInitialDate(initialDate.value);
    if (finalDate) setFinalDate(finalDate.value);
    if (lastN) setLastN(lastN.value);
  }

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
      </ChartForm>

      <ChartWrapper isLoading={isLoading} series={categoriesCount}>
        <ChartBar metadata={metadata} labels={labels} datasets={datasets} />
      </ChartWrapper>
    </ChartSection>
  );
}
