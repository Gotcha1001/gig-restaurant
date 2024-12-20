import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import MotionWrapperDelay from "../MotionWrapperDelay";

const ActionCall = () => {
  return (
    <MotionWrapperDelay
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay: 0.8 }}
      variants={{
        hidden: { opacity: 0, x: -100 },
        visible: { opacity: 1, x: 0 },
      }}
    >
      <section className=" py-20 text-center px-5">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold mb-6 text-center">
            Ready To Transform Your GIG platform?
          </h3>
          <p className="text-xl mb-12">
            Join thousands of teams already using GIGIFY to streamline their
            hiring of Gigs and boost productivity and their musical Carreers
          </p>
          <Link href="/profile">
            <Button size="lg" className="animate-bounce">
              Start For Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </MotionWrapperDelay>
  );
};

export default ActionCall;
