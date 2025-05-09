import React from 'react';
import { DropdownMenu, Button } from '@radix-ui/themes';

// Define valid Radix UI color types
type ValidRadixColor =
  | 'ruby'
  | 'gray'
  | 'gold'
  | 'bronze'
  | 'brown'
  | 'yellow'
  | 'amber'
  | 'orange'
  | 'tomato'
  | 'red'
  | 'crimson'
  | 'pink'
  | 'plum'
  | 'purple'
  | 'violet'
  | 'iris'
  | 'indigo'
  | 'blue'
  | 'cyan'
  | 'teal'
  | 'jade'
  | 'green'
  | 'grass'
  | 'lime'
  | undefined;

// Define types for dropdown items
export type DropdownItem = {
  label: string;
  shortcut?: string;
  color?: ValidRadixColor;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'item';
};

export type DropdownSeparator = {
  type: 'separator';
};

export type DropdownSubItem = {
  type: 'sub';
  label: string;
  disabled?: boolean;
  children: (DropdownItem | DropdownSeparator)[];
};

export type DropdownOption = DropdownItem | DropdownSeparator | DropdownSubItem;

interface DropdownProps {
  label?: string;
  items: DropdownOption[];
  disabled?: boolean;
}

export default function Dropdown({
  label = 'Options',
  items = [],
  disabled = false,
}: DropdownProps) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger disabled={disabled}>
        <Button variant="solid" color="gray" disabled={disabled}>
          {label}
          <DropdownMenu.TriggerIcon />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        {items.map((item, idx) => {
          if (item.type === 'separator') {
            return <DropdownMenu.Separator key={`sep-${idx}`} />;
          } else if (item.type === 'sub') {
            return (
              <DropdownMenu.Sub key={`sub-${idx}`}>
                <DropdownMenu.SubTrigger disabled={item.disabled}>
                  {item.label}
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  {item.children.map((child, cidx) => {
                    if (child.type === 'separator') {
                      return <DropdownMenu.Separator key={`sub-sep-${cidx}`} />;
                    }
                    return (
                      <DropdownMenu.Item
                        key={`sub-item-${cidx}`}
                        shortcut={child.shortcut}
                        color={child.color}
                        onSelect={child.onClick}
                        disabled={child.disabled}
                      >
                        {child.label}
                      </DropdownMenu.Item>
                    );
                  })}
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
            );
          } else {
            return (
              <DropdownMenu.Item
                key={`item-${idx}`}
                shortcut={item.shortcut}
                color={item.color}
                onSelect={item.onClick}
                disabled={item.disabled}
              >
                {item.label}
              </DropdownMenu.Item>
            );
          }
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
