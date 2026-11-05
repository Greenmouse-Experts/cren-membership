import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_EMAIL = "cren.nigeria@gmail.com";

const enquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(3, "Please add a subject"),
  message: z.string().min(10, "Please write a short message"),
});

type EnquiryValues = z.infer<typeof enquirySchema>;

const contactCards = [
  {
    icon: MapPin,
    label: "Office address",
    lines: ["Bright Star Plaza, 50 Ebiu Ukuwe Street,", "Jabi, Abuja, Nigeria."],
  },
  {
    icon: Mail,
    label: "Email address",
    lines: [CONTACT_EMAIL],
    href: `mailto:${CONTACT_EMAIL}`,
  },
  {
    icon: Phone,
    label: "Telephone",
    lines: ["+234 803 564 9073"],
    href: "tel:+2348035649073",
  },
];

export default function ContactDetails() {
  const form = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = (values: EnquiryValues) => {
    const subject = encodeURIComponent(values.subject);
    const body = encodeURIComponent(
      `Full name: ${values.fullName}\nEmail: ${values.email}\n\n${values.message}`,
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section className="relative isolate overflow-hidden border-b border-black/5 bg-[#f7faf6]">
      <img
        src="/assets/Hero4-bg.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-80"
      />

      <div className="container mx-auto px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-12">
          <div>
            <h2 className="text-balance text-[clamp(2.4rem,4.6vw,3.5rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-[#075b2f]">
              <span className="block">Get in touch</span>
              <span className="block">with CREN.</span>
            </h2>
            <p className="mt-5 max-w-[360px] text-[0.9rem] leading-[1.7] text-[#5f6b62]">
              Connect with the council using the official address, email and telephone number below.
            </p>

            <div className="mt-8 flex flex-col gap-3.5">
              {contactCards.map(({ icon: Icon, label, lines, href }) => {
                const content = (
                  <>
                    <Icon
                      aria-hidden="true"
                      className="mt-0.5 size-[18px] shrink-0 text-[#075b2f]"
                      strokeWidth={1.8}
                    />
                    <div>
                      <p className="text-[0.82rem] font-semibold text-[#173d28]">{label}</p>
                      <div className="mt-1 text-sm leading-[1.55] text-[#5f6b62]">
                        {lines.map((line) => (
                          <span key={line} className="block">
                            {line}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                );

                const cardClass =
                  "flex items-start gap-3 rounded-xl bg-[#edf4e6] p-7 transition-colors";

                return href ? (
                  <a key={label} href={href} className={`${cardClass} hover:bg-[#e5efdb]`}>
                    {content}
                  </a>
                ) : (
                  <div key={label} className={cardClass}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-[#f3f5f1] p-6 sm:p-8 lg:p-9">
            <h2 className="text-[1.6rem] font-semibold leading-[1.2] tracking-[-0.025em] text-[#075b2f]">
              Make an enquiry.
            </h2>
            <p className="mt-2 max-w-[380px] text-[0.78rem] leading-[1.6] text-[#6d766f]">
              Tell us what you would like to discuss. Your message will be prepared in your email
              application for you to review and send.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[0.76rem] font-semibold text-[#1c3a2a]">
                          Full name <span aria-hidden="true">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            autoComplete="name"
                            className="h-10 rounded-md border-[#d7dfd3] bg-white text-sm shadow-none placeholder:text-[#98a29a] focus-visible:ring-[#075b2f]/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[0.76rem] font-semibold text-[#1c3a2a]">
                          Email address <span aria-hidden="true">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="name@example.com"
                            autoComplete="email"
                            className="h-10 rounded-md border-[#d7dfd3] bg-white text-sm shadow-none placeholder:text-[#98a29a] focus-visible:ring-[#075b2f]/40"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[0.76rem] font-semibold text-[#1c3a2a]">
                        Subject <span aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="What would you like to discuss?"
                          className="h-10 rounded-md border-[#d7dfd3] bg-white text-sm shadow-none placeholder:text-[#98a29a] focus-visible:ring-[#075b2f]/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[0.76rem] font-semibold text-[#1c3a2a]">
                        Your message <span aria-hidden="true">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your message here..."
                          className="min-h-[120px] resize-none rounded-md border-[#d7dfd3] bg-white text-sm shadow-none placeholder:text-[#98a29a] focus-visible:ring-[#075b2f]/40"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="group h-11 gap-2.5 rounded-lg bg-[#084c2a] px-5 text-[0.76rem] font-semibold text-white transition-colors duration-200 hover:bg-[#063a20] focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f5f1]"
                >
                  Open Email Draft
                  <ArrowUpRight
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    strokeWidth={2.4}
                  />
                </Button>

                <p className="text-[0.68rem] leading-[1.6] text-[#7a847c]">
                  This form opens your email application; it does not send messages directly from
                  the website.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
