# PSVç ´è§£

https://www.8rom.com/69.html

https://shipengliang.com/games/psv-%E5%A6%82%E4%BD%95%E4%BD%BF%E7%94%A8%E5%8D%A1%E5%A5%97%E9%85%8D%E5%90%88tf%E5%8D%A1-%E5%9B%BE%E6%96%87%E6%95%99%E7%A8%8B.html#google_vignette







## PSV破解









```
$ diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *500.3 GB   disk0
   1:                        EFI EFI                     314.6 MB   disk0s1
   2:                 Apple_APFS Container disk1         500.0 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +500.0 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD - 数据...  340.6 GB   disk1s1
   2:                APFS Volume Preboot                 439.0 MB   disk1s2
   3:                APFS Volume Recovery                1.6 GB     disk1s3
   4:                APFS Volume VM                      10.7 GB    disk1s4
   5:                APFS Volume Macintosh HD            24.1 GB    disk1s5
   6:                APFS Volume Macintosh HD - 数据     15.4 GB    disk1s6
   7:              APFS Snapshot com.apple.os.update-... 15.4 GB    disk1s6s1

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *127.9 GB   disk2
   1:               Windows_NTFS                         127.8 GB   disk2s1
```





```
# ken @ kendeMacBook-Pro.local in ~/workspace/PSVita [9:04:00]
$ diskutil unmountDisk /dev/disk2
Unmount of all volumes on disk2 was successful

# ken @ kendeMacBook-Pro.local in ~/workspace/PSVita [9:07:46]
$ diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *500.3 GB   disk0
   1:                        EFI EFI                     314.6 MB   disk0s1
   2:                 Apple_APFS Container disk1         500.0 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +500.0 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD - 数据...  340.6 GB   disk1s1
   2:                APFS Volume Preboot                 439.0 MB   disk1s2
   3:                APFS Volume Recovery                1.6 GB     disk1s3
   4:                APFS Volume VM                      10.7 GB    disk1s4
   5:                APFS Volume Macintosh HD            24.1 GB    disk1s5
   6:                APFS Volume Macintosh HD - 数据     15.4 GB    disk1s6
   7:              APFS Snapshot com.apple.os.update-... 15.4 GB    disk1s6s1

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *127.9 GB   disk2
   1:               Windows_NTFS                         127.8 GB   disk2s1
```





```
sudo dd if=/Users/ken/workspace/PSVita/FDD-1.44MB.img of=/dev/disk2 bs=512
```





```
$ diskutil eraseDisk exfat "PSV-CARD" MBRFormat /dev/disk2
Started erase on disk2
Unmounting disk
Creating the partition map
Waiting for partitions to activate
Formatting disk2s1 as ExFAT with name PSV-CARD
Volume name      : PSV-CARD
Partition offset : 2048 sectors (1048576 bytes)
Volume size      : 249735168 sectors (127864406016 bytes)
Bytes per sector : 512
Bytes per cluster: 131072
FAT offset       : 2048 sectors (1048576 bytes)
# FAT sectors    : 8192
Number of FATs   : 1
Cluster offset   : 10240 sectors (5242880 bytes)
# Clusters       : 975488
Volume Serial #  : 692a482b
Bitmap start     : 2
Bitmap file size : 121936
Upcase start     : 3
Upcase file size : 5836
Root start       : 4
Mounting disk
Finished erase on disk2

# ken @ kendeMacBook-Pro.local in ~/workspace/PSVita [9:11:08]
$ diskutil list
/dev/disk0 (internal, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      GUID_partition_scheme                        *500.3 GB   disk0
   1:                        EFI EFI                     314.6 MB   disk0s1
   2:                 Apple_APFS Container disk1         500.0 GB   disk0s2

/dev/disk1 (synthesized):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:      APFS Container Scheme -                      +500.0 GB   disk1
                                 Physical Store disk0s2
   1:                APFS Volume Macintosh HD - 数据...  340.6 GB   disk1s1
   2:                APFS Volume Preboot                 439.0 MB   disk1s2
   3:                APFS Volume Recovery                1.6 GB     disk1s3
   4:                APFS Volume VM                      10.7 GB    disk1s4
   5:                APFS Volume Macintosh HD            24.1 GB    disk1s5
   6:                APFS Volume Macintosh HD - 数据     15.4 GB    disk1s6
   7:              APFS Snapshot com.apple.os.update-... 15.4 GB    disk1s6s1

/dev/disk2 (external, physical):
   #:                       TYPE NAME                    SIZE       IDENTIFIER
   0:     FDisk_partition_scheme                        *127.9 GB   disk2
   1:               Windows_NTFS PSV-CARD                127.9 GB   disk2s1
```





```
$ diskutil info /dev/disk2s1
   Device Identifier:         disk2s1
   Device Node:               /dev/disk2s1
   Whole:                     No
   Part of Whole:             disk2

   Volume Name:               PSV-CARD
   Mounted:                   Yes
   Mount Point:               /Volumes/PSV-CARD

   Partition Type:            Windows_NTFS
   File System Personality:   ExFAT
   Type (Bundle):             exfat
   Name (User Visible):       ExFAT

   OS Can Be Installed:       No
   Media Type:                Generic
   Protocol:                  USB
   SMART Status:              Not Supported
   Volume UUID:               6A0E3466-70B9-394C-9A46-CC43869EAB20
   Partition Offset:          1048576 Bytes (2048 512-Byte-Device-Blocks)

   Disk Size:                 127.9 GB (127864406016 Bytes) (exactly 249735168 512-Byte-Units)
   Device Block Size:         512 Bytes

   Volume Total Space:        127.9 GB (127859163136 Bytes) (exactly 249724928 512-Byte-Units)
   Volume Used Space:         11.3 MB (11272192 Bytes) (exactly 22016 512-Byte-Units) (0.0%)
   Volume Free Space:         127.8 GB (127847890944 Bytes) (exactly 249702912 512-Byte-Units) (100.0%)
   Allocation Block Size:     131072 Bytes

   Media OS Use Only:         No
   Media Read-Only:           No
   Volume Read-Only:          No

   Device Location:           External
   Removable Media:           Removable
   Media Removal:             Software-Activated

   Solid State:               Info not available
```

