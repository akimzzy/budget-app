import { View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import PieChart from "react-native-pie-chart";
import { Octicons } from "@expo/vector-icons";
import Colors from "../utils/Colors";
import Sizes from "../utils/Sizes";
import { Category } from "@/types";

export default function CircularChart({
  categorys,
}: {
  categorys: Category[];
}) {
  const widthAndHeight = 150;
  const [values, setValues] = useState<number[]>([]);
  const [colors, setColors] = useState<[string, string][]>([]);
  const [totalEstimate, setTotalEstimate] = useState(0);

  function calculateForChart() {
    let totalChartEstimate = 0;
    setValues([]);
    setColors([]);
    categorys.forEach((category) => {
      let total = 0;
      category.category_item.forEach((item) => (total += item.cost));
      setValues((prevValues) => [...prevValues, total]);
      setColors((prevColors) => [
        ...prevColors,
        [String(category.color), category.name],
      ]);
      totalChartEstimate += total;
    });
    setTotalEstimate(totalChartEstimate);
  }

  useEffect(() => {
    calculateForChart();
  }, [categorys]);

  return (
    <View
      style={{
        paddingHorizontal: Sizes.MD,
        paddingVertical: Sizes.MD,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.LIGHT_GRAY,
        borderBottomLeftRadius: Sizes.LG,
        borderBottomRightRadius: Sizes.LG,
      }}
    >
      <View style={{ display: "flex" }}>
        <Text
          style={{
            marginBottom: Sizes.MD,
            fontSize: 16,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontFamily: "Jost",
          }}
        >
          Total estimate:{" "}
          <Text style={{ fontFamily: "JostBold", fontSize: 16 }}>
            ${totalEstimate}
          </Text>
        </Text>
      </View>
      <View style={{ flexDirection: "row", gap: 30 }}>
        <PieChart
          widthAndHeight={widthAndHeight}
          series={values.length ? values : [1]}
          sliceColor={
            colors.length ? colors.map((color) => color[0]) : [Colors.GRAY]
          }
          coverRadius={0.5}
          coverFill={"#FFF"}
        />
        <View style={{ justifyContent: "center" }}>
          {colors.map((color) => (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                gap: 5,
              }}
              key={color[0]}
            >
              <Octicons name="dot-fill" size={24} color={color[0]} />
              <View>
                <Text style={{ fontFamily: "JostMedium" }}>{color[1]}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
