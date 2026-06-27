"use client";

import { useLayoutEffect, useRef } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

export default function BarChartRace({ data }) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    if (!chartRef.current) return;

    const root = am5.Root.new(chartRef.current);

    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
      am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        layout: root.verticalLayout,
      }),
    );

    // Y-axis
    const yRenderer = am5xy.AxisRendererY.new(root, {
      inversed: true,
      minGridDistance: 8,
    });

    yRenderer.labels.template.setAll({
      fill: am5.color(0x6b7280), // blue text
      fontSize: 11,
      fontWeight: "500",
    });

    const yAxis = chart.yAxes.push(
      am5xy.CategoryAxis.new(root, {
        categoryField: "category",
        renderer: yRenderer,
      }),
    );

    // X-axis
    const xRenderer = am5xy.AxisRendererX.new(root, {});

    xRenderer.labels.template.setAll({
      fill: am5.color(0x4b5563),
    });

    const xAxis = chart.xAxes.push(
      am5xy.ValueAxis.new(root, {
        min: 0,
        renderer: xRenderer,
      }),
    );

    // Series
    const series = chart.series.push(
      am5xy.ColumnSeries.new(root, {
        xAxis,
        yAxis,
        valueXField: "value",
        categoryYField: "category",

        // use color from data
        fillField: "color",
        strokeField: "color",

        sequencedInterpolation: true,
      }),
    );

    // Bar styling
    series.columns.template.setAll({
      cornerRadiusTR: 2.5,
      cornerRadiusBR: 2.5,
      height: am5.percent(50),
      tooltipText: "{categoryY}: {valueX}",
    });

    // Apply individual colors
    series.columns.template.adapters.add("fill", (fill, target) => {
      return target.dataItem?.dataContext?.color || fill;
    });

    series.columns.template.adapters.add("stroke", (stroke, target) => {
      return target.dataItem?.dataContext?.color || stroke;
    });

    // Value labels
    series.bullets.push(() => {
      return am5.Bullet.new(root, {
        locationX: 1,
        sprite: am5.Label.new(root, {
          text: "{valueX}",
          populateText: true,
          centerY: am5.percent(50),
          dx: 8,
          fill: am5.color(0x4b5563), // blue
          fontWeight: "600",
          forceHidden: true,
        }),
      });
    });

    yAxis.data.setAll(data);
    series.data.setAll(data);

    // Animate once only
    series.appear(1200);
    chart.appear(1200, 100);

    return () => {
      root.dispose();
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: "100%",
        height: "350px",
      }}
    />
  );
}
