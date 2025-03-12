"use client"

import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { format } from "date-fns"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

const baseSchema = z.object({
  title: z.string().min(2).max(50),
  description: z.string().max(25),
  category: z.string(),
  video: z.string().url(),
})

const auctionSchema = baseSchema.extend({
  type: z.literal("auction"),
  auctionType: z.enum(["premium", "public"]),
  bidType: z.enum(["live", "normal"]),
  startingBid: z.number().min(1),
  minimumBidIncrement: z.number().min(1),
  // For live auctions
  liveAuctionDateTime: z.date().optional(),
  // For normal auctions
  bidStartDateTime: z.date().optional(),
  bidEndDateTime: z.date().optional(),
})

const hiringSchema = baseSchema.extend({
  type: z.literal("hiring"),
  position: z.string(),
  salaryMin: z.number().min(0),
  salaryMax: z.number().min(0),
  requirements: z.string(),
})

const fundraisingSchema = baseSchema.extend({
  type: z.literal("fundraising"),
  goalAmount: z.number().min(1),
  deadline: z.date(),
  rewards: z.string(),
})

const normalSchema = baseSchema.extend({
  type: z.literal("normal"),
})

const pitchSchema = z.discriminatedUnion("type", [normalSchema, auctionSchema, hiringSchema, fundraisingSchema])

type PitchForm = z.infer<typeof pitchSchema>

interface CreatePitchSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreatePitchSheet({ open, onOpenChange }: CreatePitchSheetProps) {
  const [pitchType, setPitchType] = React.useState<"normal" | "auction" | "hiring" | "fundraising">("normal")
  const [bidType, setBidType] = React.useState<"live" | "normal">("normal")

  const form = useForm<PitchForm>({
    resolver: zodResolver(pitchSchema),
    defaultValues: {
      type: "normal",
      title: "",
      description: "",
      category: "",
      video: "",
    },
  })

  function onSubmit(data: PitchForm) {
    console.log(data)
    // Handle form submission
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90%] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Create a New Pitch</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pitch Type</FormLabel>
                  <Select
                    onValueChange={(value: PitchForm["type"]) => {
                      field.onChange(value)
                      setPitchType(value)
                      form.reset({
                        type: value,
                        title: "",
                        description: "",
                        category: "",
                        video: "",
                      })
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select pitch type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="auction">Auction</SelectItem>
                      <SelectItem value="hiring">Hiring</SelectItem>
                      <SelectItem value="fundraising">Fundraising</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter pitch title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (25 words max)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of your pitch"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="social">Social Impact</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="video"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video URL</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter video URL" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {pitchType === "auction" && (
              <>
                <FormField
                  control={form.control}
                  name="auctionType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Auction Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select auction type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="premium">Premium Auction</SelectItem>
                          <SelectItem value="public">Public Auction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bidType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bid Type</FormLabel>
                      <Select
                        onValueChange={(value: "live" | "normal") => {
                          field.onChange(value)
                          setBidType(value)
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select bid type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="live">Live Auction</SelectItem>
                          <SelectItem value="normal">Normal Auction</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="startingBid"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Starting Bid</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter starting bid amount"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimumBidIncrement"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Minimum Bid Increment</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter minimum bid increment"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {bidType === "live" ? (
                  <FormField
                    control={form.control}
                    name="liveAuctionDateTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Live Auction Schedule</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? format(field.value, "PPP 'at' h:mm a") : <span>Pick date and time</span>}
                                <Clock className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-4 space-y-4">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  if (date) {
                                    const currentValue = field.value || new Date()
                                    date.setHours(currentValue.getHours())
                                    date.setMinutes(currentValue.getMinutes())
                                    field.onChange(date)
                                  }
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                              />
                              <div className="flex justify-center">
                                <Input
                                  type="time"
                                  value={field.value ? format(field.value, "HH:mm") : ""}
                                  onChange={(e) => {
                                    const [hours, minutes] = e.target.value.split(":")
                                    const newDate = field.value || new Date()
                                    newDate.setHours(Number.parseInt(hours))
                                    newDate.setMinutes(Number.parseInt(minutes))
                                    field.onChange(newDate)
                                  }}
                                  className="w-32"
                                />
                              </div>
                            </div>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <>
                    <FormField
                      control={form.control}
                      name="bidStartDateTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Bid Start Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP 'at' h:mm a")
                                  ) : (
                                    <span>Pick start date and time</span>
                                  )}
                                  <Clock className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div className="p-4 space-y-4">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    if (date) {
                                      const currentValue = field.value || new Date()
                                      date.setHours(currentValue.getHours())
                                      date.setMinutes(currentValue.getMinutes())
                                      field.onChange(date)
                                    }
                                  }}
                                  disabled={(date) => date < new Date()}
                                  initialFocus
                                />
                                <div className="flex justify-center">
                                  <Input
                                    type="time"
                                    value={field.value ? format(field.value, "HH:mm") : ""}
                                    onChange={(e) => {
                                      const [hours, minutes] = e.target.value.split(":")
                                      const newDate = field.value || new Date()
                                      newDate.setHours(Number.parseInt(hours))
                                      newDate.setMinutes(Number.parseInt(minutes))
                                      field.onChange(newDate)
                                    }}
                                    className="w-32"
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="bidEndDateTime"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Bid End Date & Time</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP 'at' h:mm a")
                                  ) : (
                                    <span>Pick end date and time</span>
                                  )}
                                  <Clock className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <div className="p-4 space-y-4">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    if (date) {
                                      const currentValue = field.value || new Date()
                                      date.setHours(currentValue.getHours())
                                      date.setMinutes(currentValue.getMinutes())
                                      field.onChange(date)
                                    }
                                  }}
                                  disabled={(date) =>
                                    date < new Date() ||
                                    (form.getValues("bidStartDateTime") && date < form.getValues("bidStartDateTime"))
                                  }
                                  initialFocus
                                />
                                <div className="flex justify-center">
                                  <Input
                                    type="time"
                                    value={field.value ? format(field.value, "HH:mm") : ""}
                                    onChange={(e) => {
                                      const [hours, minutes] = e.target.value.split(":")
                                      const newDate = field.value || new Date()
                                      newDate.setHours(Number.parseInt(hours))
                                      newDate.setMinutes(Number.parseInt(minutes))
                                      field.onChange(newDate)
                                    }}
                                    className="w-32"
                                  />
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}
              </>
            )}

            {pitchType === "hiring" && (
              <>
                <FormField
                  control={form.control}
                  name="position"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Position</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter position title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salaryMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Min salary"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="salaryMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Salary</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Max salary"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Requirements</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter job requirements" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {pitchType === "fundraising" && (
              <>
                <FormField
                  control={form.control}
                  name="goalAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter goal amount"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deadline"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Deadline</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rewards"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rewards</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe backer rewards" value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <Button type="submit" className="w-full">
              Create Pitch
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

