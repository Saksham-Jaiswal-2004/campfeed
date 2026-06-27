"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { range } from "@amcharts/amcharts5/.internal/core/util/Animation";

export default function SemiPieChart({ data }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
        startAngle: 180,
        endAngle: 360,
        innerRadius: am5.percent(60),
      }),
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",
        startAngle: 180,
        endAngle: 360,
        fillField: "color",
        strokeField: "color",
      }),
    );

    series.data.setAll(data);

    series.slices.template.adapters.add("fill", (fill, target) => {
      return target.dataItem?.dataContext?.color || fill;
    });

    series.slices.template.adapters.add("stroke", (stroke, target) => {
      return target.dataItem?.dataContext?.color || stroke;
    });

    series.slices.template.setAll({
      cornerRadius: 1,
      tooltipText: "{category}: {valuePercentTotal.formatNumber('#.0')}%",
    });

    series.labels.template.setAll({
      forceHidden: true,
    });

    series.ticks.template.setAll({
      forceHidden: true,
    });

    const total = data.reduce((acc, item) => acc + item.value, 0);
    const formattedTotal = total >= 1000 ? `${(total / 1000).toFixed(1)}k` : `${total}`;

    chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: formattedTotal,
        centerX: am5.percent(50),
        centerY: am5.percent(85),
        fontSize: 28,
        fontWeight: "600",
        fill: am5.color(0x6b7280),
      }),
    );

    series.appear(1000, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "180px",
      }}
    />
  );
}
