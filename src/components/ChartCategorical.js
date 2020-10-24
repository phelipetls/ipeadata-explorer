import React, { useState, useEffect } from "react";

import { useTheme } from "@material-ui/styles";

import { limitByDate, buildMetadataUrl } from "../api/odata";
import { formatDateFromDatePicker, subtractSeriesMaxDate } from "../api/utils";

import Loading from "./Loading";
import NoData from "./NoData";
import ChartBar from "./ChartBar";
import ChartSection from "./ChartSection";
import ChartForm from "./ChartForm";
import ChartFormDate from "./ChartFormDate";

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

export default function ChartCategorical({ code, metadata }) {
  const theme = useTheme();

  const [categoriesCount, setCategoriesCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategoricalSeries() {
      const startDate = subtractSeriesMaxDate({
        metadata: metadata,
        offset: DEFAULT_LIMIT,
      });

      const dateFilter = limitByDate(startDate);
      const url =
        buildMetadataUrl(code) +
        `/ValoresStr?$apply=filter(${dateFilter})/${CATEGORY_COUNT_QUERY}`;

      setIsLoading(true);

      const response = await fetch(url);
      const json = await response.json();
      setCategoriesCount(parseJsonCount(json.value));

      setIsLoading(false);
    }

    fetchCategoricalSeries();
  }, [metadata, code]);

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

    let url = buildMetadataUrl(code);
    let dateFilter = "";

    if (initialDate.value || finalDate.value) {
      const initialDateValue = formatDateFromDatePicker(initialDate.value);
      const finalDateValue = formatDateFromDatePicker(finalDate.value);

      dateFilter = limitByDate(initialDateValue, finalDateValue);
    } else {
      dateFilter = limitByDate(
        subtractSeriesMaxDate({
          metadata: metadata,
          offset: lastN.value || DEFAULT_LIMIT,
        })
      );
    }

    url += `/ValoresStr?$apply=filter(${dateFilter})/${CATEGORY_COUNT_QUERY}`;

    setIsLoading(true);

    const response = await fetch(url);
    const json = await response.json();
    setCategoriesCount(parseJsonCount(json.value));

    setIsLoading(false);
  }

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormDate metadata={metadata} />
      </ChartForm>

      {isLoading ? (
        <Loading style={{ minHeight: theme.chart.minHeight }} />
      ) : categoriesCount.length === 0 ? (
        <NoData style={{ minHeight: theme.chart.minHeight }} />
      ) : (
        <ChartBar metadata={metadata} labels={labels} datasets={datasets} />
      )}
    </ChartSection>
  );
}
