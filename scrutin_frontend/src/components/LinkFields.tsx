import { useState } from 'react'
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command"
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover"

  import { Button } from "@/components/ui/button"

type Props = {
    doctype: string,
    value: string,
    onChange: (value: string) => void
}

const frameworks = [{
  value: "next.js",
  label: "Next.js",
},
{
  value: "sveltekit",
  label: "SvelteKit",
},
{
  value: "nuxt.js",
  label: "Nuxt.js",
},
{
  value: "remix",
  label: "Remix",
},
{
  value: "astro",
  label: "Astro",
},]

const LinkFields = ({value, onChange, doctype}: Props) => {

    const [open, setOpen] =useState(false)

    const [searchValue, setSearchValue] = useState('')
    console.log(searchValue)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? value : `Select ${doctype}`}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search..." 
          value={searchValue} 
          onValueChange={setSearchValue}/>
          <CommandList>
            <CommandEmpty>No {doctype} found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === framework.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {framework.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
export default LinkFields;