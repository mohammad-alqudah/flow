import {
  Box,
  Input,
  Stack,
  Text,
  Accordion,
  Grid,
  GridItem,
  InputGroup,
  VStack,
  HStack,
  IconButton,
  NativeSelect,
} from "@chakra-ui/react";
import {
  Search,
  Calendar,
  Truck,
  MapPin,
  X,
  FileText,
  Package,
  Users,
  Briefcase,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tooltip } from "../ui/tooltip";

interface FilterBarProps {
  filters: {
    search: string;
    // Basic Information
    type: string;
    mode: string;
    declaration_number: string;
    reference_number: string;
    // Parties
    client: string;
    shipper: string;
    consignee: string;
    notify: string;
    // Locations
    pol: string;
    pod: string;
    pol_country: string;
    pod_country: string;
    final_destination: string;
    // Dates
    etd: Date | null;
    eta: Date | null;
    created_at_range: [Date | null, Date | null];
    // Sea Freight
    mbl_number: string;
    hbl_number: string;
    shipping_line: string;
    // Air Freight
    mawb_number: string;
    hawb_number: string;
    airline: string;
    // Agents
    clearing_agent: string;
    agent: string;
    network: string;
    [key: string]: any;
  };
  onFilterChange: (filters: any) => void;
  visibleFilters: Record<string, boolean>;
  filterOptions: {
    type: string[];
    mode: string[];
    [key: string]: any;
  };
}

const filterGroups = [
  {
    id: "basic",
    title: "Basic Information",
    icon: FileText,
    filters: ["type", "mode", "declaration_number", "reference_number"],
  },
  {
    id: "parties",
    title: "Parties",
    icon: Users,
    filters: ["client", "shipper", "consignee", "notify"],
  },
  {
    id: "locations",
    title: "Locations",
    icon: MapPin,
    filters: ["pol", "pod", "pol_country", "pod_country", "final_destination"],
  },
  {
    id: "dates",
    title: "Dates",
    icon: Calendar,
    filters: ["etd", "eta", "created_at_range"],
  },
  {
    id: "sea",
    title: "Sea Freight",
    icon: Package,
    filters: ["mbl_number", "hbl_number", "shipping_line"],
  },
  {
    id: "air",
    title: "Air Freight",
    icon: Truck,
    filters: ["mawb_number", "hawb_number", "airline"],
  },
  {
    id: "agents",
    title: "Agents",
    icon: Briefcase,
    filters: ["clearing_agent", "agent", "network"],
  },
];

export function FilterBar({
  filters,
  onFilterChange,
  visibleFilters,
  filterOptions,
}: FilterBarProps) {
  const handleClearFilter = (filterKey: string) => {
    onFilterChange({
      ...filters,
      [filterKey]: Array.isArray(filters[filterKey]) ? [null, null] : "",
    });
  };

  const renderFilterInput = (filterId: string) => {
    const label = filterId
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    if (filterId === "type" || filterId === "mode") {
      return (
        <NativeSelect.Root>
          <NativeSelect.Field
            value={filters[filterId]}
            onChange={(e) =>
              onFilterChange({ ...filters, [filterId]: e.target.value })
            }
            placeholder={`All ${label}s`}
          >
            {filterOptions[filterId]?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </NativeSelect.Field>
        </NativeSelect.Root>
      );
    }

    if (filterId === "etd" || filterId === "eta") {
      return (
        <DatePicker
          selected={filters[filterId]}
          onChange={(date) => onFilterChange({ ...filters, [filterId]: date })}
          customInput={<Input />}
          placeholderText={label}
          isClearable
        />
      );
    }

    if (filterId === "created_at_range") {
      return (
        <VStack gap={2}>
          <DatePicker
            selected={filters[filterId][0]}
            onChange={(date) =>
              onFilterChange({
                ...filters,
                [filterId]: [date, filters[filterId][1]],
              })
            }
            customInput={<Input w={"full"} />}
            placeholderText="Start Date"
            isClearable
          />
          <DatePicker
            selected={filters[filterId][1]}
            onChange={(date) =>
              onFilterChange({
                ...filters,
                [filterId]: [filters[filterId][0], date],
              })
            }
            customInput={<Input />}
            placeholderText="End Date"
            isClearable
          />
        </VStack>
      );
    }

    return (
      <Input
        placeholder={`Filter by ${label.toLowerCase()}...`}
        value={filters[filterId]}
        onChange={(e) =>
          onFilterChange({ ...filters, [filterId]: e.target.value })
        }
      />
    );
  };

  // Filter out groups with no visible filters
  const activeFilterGroups = filterGroups.filter((group) =>
    group.filters.some((filterId) => visibleFilters[filterId])
  );

  return (
    <Box bg="white" p={6} borderRadius="lg" shadow="sm">
      <Stack gap={6}>
        <InputGroup startElement={<Search className="h-5 w-5 text-gray-400" />}>
          <Input
            placeholder="Search orders by reference number, client, or description..."
            value={filters.search}
            onChange={(e) =>
              onFilterChange({ ...filters, search: e.target.value })
            }
          />
        </InputGroup>

        <Accordion.Root
          defaultValue={activeFilterGroups.map((_, index) => `${index}`)}
          multiple
        >
          {activeFilterGroups.map((group) => {
            const visibleGroupFilters = group.filters.filter(
              (filterId) => visibleFilters[filterId]
            );

            if (visibleGroupFilters.length === 0) return null;

            return (
              <Accordion.Item key={group.id} value={group.id} border="none">
                {visibleGroupFilters.length > 1 && (
                  <Accordion.ItemTrigger px={0} _hover={{ bg: "transparent" }}>
                    <HStack flex="1">
                      <group.icon className="h-5 w-5 text-gray-400" />
                      <Text fontWeight="medium">{group.title}</Text>
                    </HStack>
                  </Accordion.ItemTrigger>
                )}
                <Accordion.ItemContent pb={4} px={0}>
                  <Grid
                    templateColumns="repeat(auto-fit, minmax(250px, 1fr))"
                    gap={4}
                  >
                    {visibleGroupFilters.map((filterId) => (
                      <GridItem key={filterId}>
                        <VStack align="stretch" gap={2}>
                          <HStack justify="space-between">
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="gray.700"
                            >
                              {filterId
                                .split("_")
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </Text>
                            {filters[filterId] && (
                              <Tooltip content="Clear filter">
                                <IconButton
                                  size="xs"
                                  aria-label="Clear filter"
                                  variant="ghost"
                                  onClick={() => handleClearFilter(filterId)}
                                >
                                  <X className="h-4 w-4" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </HStack>
                          {renderFilterInput(filterId)}
                        </VStack>
                      </GridItem>
                    ))}
                  </Grid>
                </Accordion.ItemContent>
              </Accordion.Item>
            );
          })}
        </Accordion.Root>
      </Stack>
    </Box>
  );
}
