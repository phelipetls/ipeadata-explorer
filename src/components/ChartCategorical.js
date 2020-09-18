import React, { useState, useEffect } from "react";
import Loading from "./Loading";
import ChartBar from "./ChartBar";
import ChartSection from "./ChartSection";
import ChartForm from "./ChartForm";
import ChartFormTimeInterval from "./ChartFormTimeInterval";

import { buildMetadataUrl } from "../api/odata";

const CATEGORY_COUNT_QUERY =
  "groupby((VALVALOR),aggregate($count as totalCount))&$orderby=totalCount desc";

const parseJsonCount = json =>
  json.reduce(
    (obj, category) => ({
      ...obj,
      [category.VALVALOR]: category.totalCount
    }),
    {}
  );

export default function ChartCategorical({ code, metadata }) {
  const [count, setCount] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const maxYear = metadata.SERMAXDATA.slice(0, 4);
  const [period, setPeriod] = useState(maxYear);

  useEffect(() => {
    async function fetchCategoricalSeries() {
      const url =
        buildMetadataUrl(code) +
        `/ValoresStr?$apply=filter(year(VALDATA) eq ${maxYear})/${CATEGORY_COUNT_QUERY}`;

      setIsLoading(true);
      const response = await fetch(url);
      const json = await response.json();
      setCount(parseJsonCount(json.value));
      setIsLoading(false);
    }

    fetchCategoricalSeries();
  }, [code, maxYear]);

  const labels = Object.keys(count);
  const datasets = [
    {
      label: metadata.UNINOME,
      data: Object.values(count)
    }
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    let { initialDate, finalDate, topN } = e.target.elements;

    const initialYear = new Date(initialDate.value).getFullYear();
    const finalYear = new Date(finalDate.value).getFullYear();

    let url = buildMetadataUrl(code);
    const filters = [];

    if (topN.value) {
      // This assumes that every categorical series has a quadrennial periodicity, which is true
      // as of 20/09/2020. For now, I'm not going to bother.
      const minYear = maxYear - topN.value * 4;
      filters.push(`year(VALDATA) ge ${minYear}`);
      setPeriod(`${minYear} a ${maxYear}`);
    } else if (initialYear || finalYear) {
      setPeriod(
        initialYear && finalYear
        ? `${initialYear} a ${finalYear}`
        : initialYear || finalYear
      );

      initialYear && filters.push(`year(VALDATA) ge ${initialYear}`);
      finalYear && filters.push(`year(VALDATA) le ${finalYear}`);
    } else {
      return;
    }

    const joinedFilters = filters.join(" and ");
    url += `/ValoresStr?$apply=filter(${joinedFilters})/${CATEGORY_COUNT_QUERY}`;

    setIsLoading(true);
    const response = await fetch(url);
    const json = await response.json();
    setCount(parseJsonCount(json.value));
    setIsLoading(false);
  }

  return (
    <ChartSection>
      <ChartForm onSubmit={handleSubmit}>
        <ChartFormTimeInterval metadata={metadata} />
      </ChartForm>

      {isLoading ? (
        <Loading style={{ minHeight: 512 }} />
      ) : (
        <ChartBar
          period={period}
          metadata={metadata}
          labels={labels}
          datasets={datasets}
        />
      )}
    </ChartSection>
  );
}
