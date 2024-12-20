import React from "react";
import features from "./Features";
import FeatureMotionWrapper from "../FeatureMotionWrapper";
import { Card, CardContent } from "../ui/card";

// Define the type for a single feature
interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Explicitly type the features array
const typedFeatures: Feature[] = features;

const FeatureCard: React.FC = () => {
  return (
    <section className="gradient-background2 py-20 px-5">
      <div className="container mx-auto">
        <h3 className="text-3xl font-bold mb-12 text-center">Key Features</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {typedFeatures.map((feature, index) => {
            return (
              <FeatureMotionWrapper key={index} index={index}>
                <Card className="bg-gradient-to-r from-purple-800 via-indigo-700 to-gray-800">
                  <CardContent className="pt-6">
                    <feature.icon className="h-12 w-12 mb-4 text-indigo-300" />
                    <h4 className="text-xl font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-gray-400">{feature.description}</p>
                  </CardContent>
                </Card>
              </FeatureMotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureCard;
