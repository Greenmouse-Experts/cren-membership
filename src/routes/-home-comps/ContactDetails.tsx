import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowUpRight, CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import usePostHook from "@/app/hook/usePost";
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
import { anchored_shape } from "@/helpers/ui";

const CONTACT_EMAIL = "cren.nigeria@gmail.com";

const enquirySchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Enter a valid email address"),
  phoneNumber: z
    .string()
    .min(7, "Please enter a valid phone number")
    .regex(/^[\d\s+()-]+$/, "Enter a valid phone number"),
  subject: z.string().min(3, "Please add a subject"),
  message: z.string().min(10, "Please write a short message"),
});

type EnquiryValues = z.infer<typeof enquirySchema>;

/** Payload accepted by `POST submit/contact`. */
interface ContactPayload {
  full_name: string;
  email: string;
  phone_number: string;
  subject: string;
  message: string;
}

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
  const { handlePost, isPending } = usePostHook();

  const form = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: EnquiryValues) => {
    const payload: ContactPayload = {
      full_name: values.fullName.trim(),
      email: values.email.trim(),
      phone_number: values.phoneNumber.trim(),
      subject: values.subject.trim(),
      message: values.message.trim(),
    };

    const response = await handlePost("submit/contact", payload, "application/json");

    // `handlePost` swallows failures and reports them via toast; only reset on success.
    if (!response) return;

    toast.success(response?.message || "Your message has been sent. We'll be in touch soon.");
    form.reset();
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

                const cardClass = "flex items-start gap-3 bg-[#edf4e6] p-7 transition-colors";

                return href ? (
                  <a
                    key={label}
                    href={href}
                    className={`${cardClass} hover:bg-[#e5efdb]`}
                    style={anchored_shape}
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label} className={cardClass} style={anchored_shape}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-[#f3f5f1] p-6 sm:p-8 lg:p-9" style={anchored_shape}>
            <h2 className="text-[1.6rem] font-semibold leading-[1.2] tracking-[-0.025em] text-[#075b2f]">
              Make an enquiry.
            </h2>
            <p className="mt-2 max-w-[380px] text-[0.78rem] leading-[1.6] text-[#6d766f]">
              Tell us what you would like to discuss and send your message straight to the CREN
              secretariat.
            </p>

            {form.formState.isSubmitSuccessful && !isPending ? (
              <div className="mt-6 flex items-start gap-3 rounded-lg bg-[#e3f0d9] p-5">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-0.5 size-5 shrink-0 text-[#075b2f]"
                />
                <div>
                  <p className="text-sm font-semibold text-[#173d28]">Message sent</p>
                  <p className="mt-1 text-[0.78rem] leading-[1.6] text-[#5f6b62]">
                    Thank you for reaching out. The CREN team will respond to the email address you
                    provided.
                  </p>
                  <button
                    type="button"
                    onClick={() => form.reset()}
                    className="mt-3 text-[0.76rem] font-semibold text-[#075b2f] underline underline-offset-4 hover:text-[#063a20] cursor-pointer"
                  >
                    Send another message
                  </button>
                </div>
              </div>
            ) : (
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
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[0.76rem] font-semibold text-[#1c3a2a]">
                            Phone number <span aria-hidden="true">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              inputMode="tel"
                              placeholder="+234 800 000 0000"
                              autoComplete="tel"
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
                    disabled={isPending}
                    className="group h-11 gap-2.5 rounded-lg bg-[#084c2a] px-5 text-[0.76rem] font-semibold text-white transition-colors duration-200 hover:bg-[#063a20] focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f3f5f1] disabled:opacity-70"
                  >
                    {isPending ? (
                      <>
                        Sending
                        <Loader2 aria-hidden="true" className="size-4 animate-spin" />
                      </>
                    ) : (
                      <>
                        Send Message
                        <ArrowUpRight
                          aria-hidden="true"
                          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          strokeWidth={2.4}
                        />
                      </>
                    )}
                  </Button>

                  <p className="text-[0.68rem] leading-[1.6] text-[#7a847c]">
                    Your details are only used to respond to this enquiry.
                  </p>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
