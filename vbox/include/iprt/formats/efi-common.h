/* $Id: efi-common.h 90342 2021-07-26 16:12:34Z vboxsync $ */
/** @file
 * IPRT, EFI common definitions.
 */

/*
 * Copyright (C) 2021 Oracle Corporation
 *
 * This file is part of VirtualBox Open Source Edition (OSE), as
 * available from http://www.virtualbox.org. This file is free software;
 * you can redistribute it and/or modify it under the terms of the GNU
 * General Public License (GPL) as published by the Free Software
 * Foundation, in version 2 as it comes in the "COPYING" file of the
 * VirtualBox OSE distribution. VirtualBox OSE is distributed in the
 * hope that it will be useful, but WITHOUT ANY WARRANTY of any kind.
 *
 * The contents of this file may alternatively be used under the terms
 * of the Common Development and Distribution License Version 1.0
 * (CDDL) only, as it comes in the "COPYING.CDDL" file of the
 * VirtualBox OSE distribution, in which case the provisions of the
 * CDDL are applicable instead of those of the GPL.
 *
 * You may elect to license modified versions of this file under the
 * terms and conditions of either the GPL or the CDDL or both.
 */

#ifndef IPRT_INCLUDED_formats_efi_common_h
#define IPRT_INCLUDED_formats_efi_common_h
#ifndef RT_WITHOUT_PRAGMA_ONCE
# pragma once
#endif

#include <iprt/types.h>
#include <iprt/assertcompile.h>

/**
 * EFI GUID.
 */
typedef struct EFI_GUID
{
    uint32_t        u32Data1;
    uint16_t        u16Data2;
    uint16_t        u16Data3;
    uint8_t         abData4[8];
} EFI_GUID;
AssertCompileSize(EFI_GUID, 16);
/** Pointer to an EFI GUID. */
typedef EFI_GUID *PEFI_GUID;
/** Pointer to a const EFI GUID. */
typedef const EFI_GUID *PCEFI_GUID;


/** A Null GUID. */
#define EFI_NULL_GUID { 0, 0, 0, { 0, 0, 0, 0, 0, 0, 0, 0 }}
/** Global variable GUID. */
#define EFI_GLOBAL_VARIABLE_GUID \
    { 0x8be4df61, 0x93ca, 0x11d2, { 0xaa, 0x0d, 0x00, 0xe0, 0x98, 0x03, 0x2b, 0x8c }}
/** SecureBootEnable variable GUID. */
#define EFI_SECURE_BOOT_ENABLE_DISABLE_GUID \
    { 0xf0a30bc7, 0xaf08, 0x4556, { 0x99, 0xc4, 0x0, 0x10, 0x9, 0xc9, 0x3a, 0x44 } }


/**
 * EFI time value.
 */
typedef struct EFI_TIME
{
    uint16_t        u16Year;
    uint8_t         u8Month;
    uint8_t         u8Day;
    uint8_t         u8Hour;
    uint8_t         u8Minute;
    uint8_t         u8Second;
    uint8_t         bPad0;
    uint32_t        u32Nanosecond;
    int16_t         iTimezone;
    uint8_t         u8Daylight;
    uint8_t         bPad1;
} EFI_TIME;
AssertCompileSize(EFI_TIME, 16);
/** Pointer to an EFI time abstraction. */
typedef EFI_TIME *PEFI_TIME;
/** Pointer to a const EFI time abstraction. */
typedef const EFI_TIME *PCEFI_TIME;

#define EFI_TIME_TIMEZONE_UNSPECIFIED   INT16_C(0x07ff)

#define EFI_TIME_DAYLIGHT_ADJUST        RT_BIT(0)
#define EFI_TIME_DAYLIGHT_INDST         RT_BIT(1)

#endif /* !IPRT_INCLUDED_formats_efi_common_h */

