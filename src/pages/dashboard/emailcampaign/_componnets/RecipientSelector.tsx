import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

export const RecipientSelector = ({ value, onChange, onPreviewCount }) => {
    return (
      <div className="space-y-4">
        <div>
          <Label>Location Filter</Label>
          <Select 
            multiple 
            value={value.locations} 
            onChange={(locations) => onChange({...value, locations})}
          >
            {/* Location options */}
          </Select>
        </div>
  
        <div>
          <Label>Order History</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Total Orders</Label>
              <Input 
                type="number"
                value={value.minTotalOrders}
                onChange={(e) => onChange({...value, minTotalOrders: parseInt(e.target.value)})}
              />
            </div>
            <div>
              <Label>Max Total Orders</Label>
              <Input 
                type="number"
                value={value.maxTotalOrders}
                onChange={(e) => onChange({...value, maxTotalOrders: parseInt(e.target.value)})}
              />
            </div>
          </div>
        </div>
  
        <div>
          <Label>Customer Value</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Min Total Spent</Label>
              <Input 
                type="number"
                value={value.minTotalSpent}
                onChange={(e) => onChange({...value, minTotalSpent: parseFloat(e.target.value)})}
              />
            </div>
            <div>
              <Label>Max Total Spent</Label>
              <Input 
                type="number"
                value={value.maxTotalSpent}
                onChange={(e) => onChange({...value, maxTotalSpent: parseFloat(e.target.value)})}
              />
            </div>
          </div>
        </div>
  
        <div>
          <Label>Last Order Date Range</Label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>From</Label>
              <Input 
                type="date"
                value={value.lastOrderStart}
                onChange={(e) => onChange({...value, lastOrderStart: e.target.value})}
              />
            </div>
            <div>
              <Label>To</Label>
              <Input 
                type="date"
                value={value.lastOrderEnd}
                onChange={(e) => onChange({...value, lastOrderEnd: e.target.value})}
              />
            </div>
          </div>
        </div>
  
        <div>
          <Label>Tags</Label>
          <Select 
            multiple 
            value={value.tags} 
            onChange={(tags) => onChange({...value, tags})}
          >
            {/* Tag options */}
          </Select>
        </div>
  
        <div>
          <Label>Exclude Tags</Label>
          <Select 
            multiple 
            value={value.excludeTags} 
            onChange={(excludeTags) => onChange({...value, excludeTags})}
          >
            {/* Exclude tag options */}
          </Select>
        </div>
  
        <div>
          <Label>Excluded Emails</Label>
          <textarea 
            value={value.excludeEmails?.join('\n')}
            onChange={(e) => onChange({...value, excludeEmails: e.target.value.split('\n')})}
            className="w-full h-32"
            placeholder="Enter email addresses to exclude (one per line)"
          />
        </div>
      </div>
    );
  };