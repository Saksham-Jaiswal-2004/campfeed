"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5percent from "@amcharts/amcharts5/percent";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function PieChart({ data }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    // const chart = root.container.children.push(
    //   am5percent.PieChart.new(root, {
    //     layout: root.verticalLayout,
    //   }),
    // );

    const chart = root.container.children.push(
      am5percent.PieChart.new(root, {
        innerRadius: am5.percent(60),
        layout: root.verticalLayout,
      }),
    );

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const centerLabel = chart.seriesContainer.children.push(
      am5.Label.new(root, {
        text: `[bold fontSize:24]${total}[/]\nTotal`,
        centerX: am5.percent(50),
        centerY: am5.percent(50),
        textAlign: "center",
        populateText: true,
        fill: am5.color(0x374151),
      }),
    );

    const series = chart.series.push(
      am5percent.PieSeries.new(root, {
        valueField: "value",
        categoryField: "category",

        // label inside slices
        alignLabels: false,
      }),
    );

    // Slice styling
    series.slices.template.setAll({
      tooltipText: "{category}: {value}",
      strokeWidth: 1,
      stroke: am5.color(0xffffff),
      cornerRadius: 1,
    });

    // Labels
    series.labels.template.setAll({
      fill: am5.color(0x4b5563),
      fontSize: 12,
      text: "{category}",
    });

    // Ticks (connector lines)
    series.ticks.template.setAll({
      stroke: am5.color(0x9ca3af),
    });

    // Apply colors from data
    series.slices.template.adapters.add("fill", (fill, target) => {
      return target.dataItem?.dataContext?.color || fill;
    });

    series.slices.template.adapters.add("stroke", (stroke, target) => {
      return target.dataItem?.dataContext?.color || stroke;
    });

    // Set data
    series.data.setAll(data);

    // Animation
    series.appear(1200, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "150px",
      }}
    />
  );
}
