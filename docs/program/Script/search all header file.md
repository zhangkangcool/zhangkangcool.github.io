```shell
#!/usr/bin/bash
set -x
# gcc header search path
# /usr/lib/gcc/ppc64le-redhat-linux/8/include
# /usr/local/include
# /usr/include

#INCPATH=(/usr/lib/gcc/ppc64le-redhat-linux/8/include /usr/local/include /usr/include)
SHELL_FOLDER=$(cd "$(dirname "$0")";pwd)
CHEAD_LIST=${SHELL_FOLDER}/chead.list
CPPHEAD_LIST=${SHELL_FOLDER}/cpphead.list
INCPATH[0]=/usr/lib/gcc/ppc64le-redhat-linux/8/include
INCFILTER[0]=""
INCPATH[1]=/usr/local/include
INCFILTER[1]=""
INCPATH[2]=/usr/include
INCFILTER[2]="( -path ./EGL -o -path ./GL -o -path ./qt5 -o -path ./valgrind -o -path ./xen -o -path ./X11 -o -path ./python3.Gm -o -path ./libkms -o -path ./libdrm )"
#for dir in ${INCPATH[@]}
for i in "${!INCPATH[@]}";
do
	echo ${INCPATH[$i]}
#	echo ${INCPATH[$i]} >> ${CHEAD_LIST}
	cd ${INCPATH[$i]}
	echo ${INCFILTER[$i]}
#	cd /home/admin/shkzhang/ATscript_default
#	filter="( -path ./default_error -o -path ./default_test )"
	if [[ x"${INCFILTER[$i]}" == x ]]; then
		find . -type f -print >> ${CHEAD_LIST} 2>&1
	else
		find . ${INCFILTER[$i]} -prune -o -type f -print >> ${CHEAD_LIST} 2>&1
	fi
done

# g++ header search path
# /usr/lib/gcc/ppc64le-redhat-linux/8/include
# /usr/local/include
# /usr/include
# /usr/lib/gcc/ppc64le-redhat-linux/8/../../../../include/c++/8
# /usr/lib/gcc/ppc64le-redhat-linux/8/../../../../include/c++/8/ppc64le-redhat-linux
# /usr/lib/gcc/ppc64le-redhat-linux/8/../../../../include/c++/8/backward
INCPATH[3]=/usr/lib/gcc/ppc64le-redhat-linux/8/../../../../include/c++/8
INCFILTER[3]=""
INCPATH[4]=/usr/lib/gcc/ppc64le-redhat-linux/8/../../../../include/c++/8/ppc64le-redhat-linux
INCFILTER[4]=""
INCPATH[5]=/usr/lib/gcc/ppc64le-redhat-linux/8/../../../../include/c++/8/backward
INCFILTER[5]=""
#for dir in ${INCPATH[@]}
for i in "${!INCPATH[@]}";
do
	echo ${INCPATH[$i]}
#	echo ${INCPATH[$i]} >> ${CPPHEAD_LIST}
	cd ${INCPATH[$i]}
	echo ${INCFILTER[$i]}
#	cd /home/admin/shkzhang/ATscript_default
#	filter="( -path ./default_error -o -path ./default_test )"
	if [[ x"${INCFILTER[$i]}" == x ]]; then
		find . -type f -print >> ${CPPHEAD_LIST} 2>&1
	else
		find . ${INCFILTER[$i]} -prune -o -type f -print >> ${CPPHEAD_LIST} 2>&1
	fi
done

# ./stdio.h --> stdio.h
sed -i "s/\.\///g" ${CHEAD_LIST}
sed -i "s/\.\///g" ${CPPHEAD_LIST}
```

