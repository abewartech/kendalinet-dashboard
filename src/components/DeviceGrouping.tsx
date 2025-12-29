import { useState, useEffect } from "react";
import { Users, Plus, Edit2, Trash2, Smartphone, Laptop, Tv, Gamepad2, FolderOpen, ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface DeviceGroup {
  id: string;
  name: string;
  description: string;
  color: string;
  deviceMacs: string[];
  createdAt: string;
}

interface Device {
  id: string;
  name: string;
  mac: string;
  ip: string;
  connected: boolean;
  type?: string;
}

interface DeviceGroupingProps {
  devices: Device[];
}

const groupColors = [
  { id: "blue", label: "Biru", class: "bg-blue-500" },
  { id: "green", label: "Hijau", class: "bg-green-500" },
  { id: "yellow", label: "Kuning", class: "bg-yellow-500" },
  { id: "red", label: "Merah", class: "bg-red-500" },
  { id: "purple", label: "Ungu", class: "bg-purple-500" },
  { id: "orange", label: "Oranye", class: "bg-orange-500" },
];

const deviceIcons: Record<string, React.ReactNode> = {
  phone: <Smartphone className="w-4 h-4" />,
  laptop: <Laptop className="w-4 h-4" />,
  tv: <Tv className="w-4 h-4" />,
  gaming: <Gamepad2 className="w-4 h-4" />,
};

export const DeviceGrouping = ({ devices }: DeviceGroupingProps) => {
  const [groups, setGroups] = useState<DeviceGroup[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<DeviceGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const [newGroupColor, setNewGroupColor] = useState("blue");
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("kendalinet_device_groups");
    if (saved) {
      setGroups(JSON.parse(saved));
    }
  }, []);

  const saveGroups = (newGroups: DeviceGroup[]) => {
    setGroups(newGroups);
    localStorage.setItem("kendalinet_device_groups", JSON.stringify(newGroups));
  };

  const handleAddGroup = () => {
    if (!newGroupName.trim()) {
      toast({
        title: "Nama Grup Diperlukan",
        description: "Masukkan nama untuk grup ini.",
        variant: "destructive",
      });
      return;
    }

    const newGroup: DeviceGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      description: newGroupDescription,
      color: newGroupColor,
      deviceMacs: selectedDevices,
      createdAt: new Date().toISOString(),
    };

    saveGroups([...groups, newGroup]);
    resetForm();
    setIsDialogOpen(false);
    toast({
      title: "Grup Berhasil Dibuat",
      description: `Grup "${newGroupName}" dengan ${selectedDevices.length} perangkat.`,
    });
  };

  const handleEditGroup = () => {
    if (!editingGroup || !newGroupName.trim()) return;

    const updatedGroups = groups.map((g) =>
      g.id === editingGroup.id
        ? { ...g, name: newGroupName, description: newGroupDescription, color: newGroupColor, deviceMacs: selectedDevices }
        : g
    );

    saveGroups(updatedGroups);
    resetForm();
    setIsDialogOpen(false);
    toast({
      title: "Grup Berhasil Diperbarui",
      description: `Grup "${newGroupName}" telah diperbarui.`,
    });
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    saveGroups(groups.filter((g) => g.id !== groupId));
    toast({
      title: "Grup Dihapus",
      description: `Grup "${group?.name}" telah dihapus.`,
      variant: "destructive",
    });
  };

  const resetForm = () => {
    setNewGroupName("");
    setNewGroupDescription("");
    setNewGroupColor("blue");
    setSelectedDevices([]);
    setEditingGroup(null);
  };

  const openEditDialog = (group: DeviceGroup) => {
    setEditingGroup(group);
    setNewGroupName(group.name);
    setNewGroupDescription(group.description);
    setNewGroupColor(group.color);
    setSelectedDevices(group.deviceMacs);
    setIsDialogOpen(true);
  };

  const toggleDeviceSelection = (mac: string) => {
    setSelectedDevices((prev) =>
      prev.includes(mac) ? prev.filter((m) => m !== mac) : [...prev, mac]
    );
  };

  const toggleGroupExpand = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  const getDeviceByMac = (mac: string) => devices.find((d) => d.mac === mac);

  const getColorClass = (colorId: string) => groupColors.find((c) => c.id === colorId)?.class || "bg-gray-500";

  // Devices not in any group
  const ungroupedDevices = devices.filter(
    (device) => !groups.some((group) => group.deviceMacs.includes(device.mac))
  );

  return (
    <div className="space-y-4">
      <Card className="glass-card border-border/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Grup Perangkat
              </CardTitle>
              <CardDescription>
                Kelompokkan perangkat per pelanggan, ruangan, atau keluarga
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm(); }}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-1">
                  <Plus className="w-4 h-4" />
                  Buat Grup
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingGroup ? "Edit Grup" : "Buat Grup Baru"}</DialogTitle>
                  <DialogDescription>
                    Kelompokkan perangkat untuk memudahkan pengelolaan.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="group-name">Nama Grup</Label>
                    <Input
                      id="group-name"
                      placeholder="contoh: Rumah Pak Budi"
                      value={newGroupName}
                      onChange={(e) => setNewGroupName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="group-desc">Deskripsi (opsional)</Label>
                    <Input
                      id="group-desc"
                      placeholder="contoh: Pelanggan RT 05"
                      value={newGroupDescription}
                      onChange={(e) => setNewGroupDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Warna Label</Label>
                    <div className="flex flex-wrap gap-2">
                      {groupColors.map((color) => (
                        <button
                          key={color.id}
                          onClick={() => setNewGroupColor(color.id)}
                          className={`w-8 h-8 rounded-full ${color.class} transition-all ${
                            newGroupColor === color.id ? "ring-2 ring-offset-2 ring-primary" : ""
                          }`}
                          title={color.label}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Pilih Perangkat</Label>
                    <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-lg bg-secondary/30 border border-border/30">
                      {devices.length === 0 ? (
                        <p className="text-xs text-muted-foreground text-center py-4">
                          Tidak ada perangkat tersedia
                        </p>
                      ) : (
                        devices.map((device) => (
                          <div
                            key={device.mac}
                            onClick={() => toggleDeviceSelection(device.mac)}
                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all ${
                              selectedDevices.includes(device.mac)
                                ? "bg-primary/10 border border-primary/30"
                                : "hover:bg-secondary/50"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              device.connected ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                            }`}>
                              {deviceIcons[device.type || "phone"] || <Smartphone className="w-4 h-4" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{device.name}</p>
                              <p className="text-xs text-muted-foreground font-mono">{device.mac}</p>
                            </div>
                            <div className={`w-4 h-4 rounded border-2 transition-all ${
                              selectedDevices.includes(device.mac)
                                ? "bg-primary border-primary"
                                : "border-muted-foreground"
                            }`} />
                          </div>
                        ))
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedDevices.length} perangkat dipilih
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => { setIsDialogOpen(false); resetForm(); }}>
                    Batal
                  </Button>
                  <Button onClick={editingGroup ? handleEditGroup : handleAddGroup}>
                    {editingGroup ? "Simpan Perubahan" : "Buat Grup"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {groups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Belum ada grup perangkat</p>
              <p className="text-xs">Buat grup untuk mengorganisir perangkat</p>
            </div>
          ) : (
            groups.map((group) => {
              const isExpanded = expandedGroups.includes(group.id);
              const groupDevices = group.deviceMacs.map(getDeviceByMac).filter(Boolean);
              const onlineCount = groupDevices.filter((d) => d?.connected).length;

              return (
                <Collapsible key={group.id} open={isExpanded} onOpenChange={() => toggleGroupExpand(group.id)}>
                  <div className="rounded-xl border border-border/30 overflow-hidden">
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
                        <div className={`w-3 h-3 rounded-full ${getColorClass(group.color)}`} />
                        <div className="flex-1 text-left">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{group.name}</span>
                            <Badge variant="secondary" className="text-[10px]">
                              {groupDevices.length} perangkat
                            </Badge>
                            <Badge variant={onlineCount > 0 ? "default" : "secondary"} className="text-[10px]">
                              {onlineCount} online
                            </Badge>
                          </div>
                          {group.description && (
                            <p className="text-xs text-muted-foreground">{group.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            onClick={(e) => { e.stopPropagation(); openEditDialog(group); }}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-3 pb-3 space-y-2">
                        {groupDevices.length === 0 ? (
                          <p className="text-xs text-muted-foreground text-center py-2">
                            Tidak ada perangkat dalam grup ini
                          </p>
                        ) : (
                          groupDevices.map((device) => device && (
                            <div
                              key={device.mac}
                              className="flex items-center gap-3 p-2 rounded-lg bg-secondary/20"
                            >
                              <div className={`w-2 h-2 rounded-full ${device.connected ? "bg-success" : "bg-muted-foreground"}`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-medium truncate">{device.name}</p>
                                <p className="text-[10px] text-muted-foreground font-mono">{device.ip}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })
          )}

          {/* Ungrouped Devices */}
          {ungroupedDevices.length > 0 && (
            <Collapsible>
              <div className="rounded-xl border border-dashed border-border/30 overflow-hidden">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center gap-3 p-3 hover:bg-secondary/30 transition-colors">
                    <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                    <div className="flex-1 text-left">
                      <span className="font-semibold text-sm text-muted-foreground">Tanpa Grup</span>
                      <Badge variant="secondary" className="ml-2 text-[10px]">
                        {ungroupedDevices.length} perangkat
                      </Badge>
                    </div>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="px-3 pb-3 space-y-2">
                    {ungroupedDevices.map((device) => (
                      <div
                        key={device.mac}
                        className="flex items-center gap-3 p-2 rounded-lg bg-secondary/20"
                      >
                        <div className={`w-2 h-2 rounded-full ${device.connected ? "bg-success" : "bg-muted-foreground"}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{device.name}</p>
                          <p className="text-[10px] text-muted-foreground font-mono">{device.ip}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
