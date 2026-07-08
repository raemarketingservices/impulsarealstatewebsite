import { NextRequest, NextResponse } from 'next/server'

/**
 * Extracts image URLs from a public Google Drive folder.
 * The folder must be shared as "Anyone with the link can view".
 *
 * Google Drive doesn't have a simple public API for listing folder contents
 * without authentication. We use a workaround: the folder's public sharing
 * page returns HTML that we can parse for file IDs.
 */
export async function POST(request: NextRequest) {
  try {
    const { folderUrl } = await request.json()

    if (!folderUrl) {
      return NextResponse.json({ success: false, error: 'Folder URL required' }, { status: 400 })
    }

    // Extract folder ID from various Google Drive URL formats
    let folderId = ''
    const patterns = [
      /folders\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /([a-zA-Z0-9_-]{25,})/,
    ]
    for (const p of patterns) {
      const match = folderUrl.match(p)
      if (match) {
        folderId = match[1]
        break
      }
    }

    if (!folderId) {
      return NextResponse.json({ success: false, error: 'Could not extract folder ID from URL' }, { status: 400 })
    }

    // Try to fetch the folder's public listing
    // Google Drive public folders can be accessed via the embed URL
    const listUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`

    const response = await fetch(listUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IMPULSABot/1.0)',
      },
    })

    if (!response.ok) {
      return NextResponse.json({
        success: false,
        error: 'Could not access folder. Make sure it is shared as "Anyone with the link can view".',
      }, { status: 400 })
    }

    const html = await response.text()

    // Extract file IDs from the HTML response
    // Google Drive embed page contains links like: https://drive.google.com/file/d/FILE_ID/
    const fileIds = new Set<string>()
    const regex = /\/file\/d\/([a-zA-Z0-9_-]{20,})/g
    let match
    while ((match = regex.exec(html)) !== null) {
      fileIds.add(match[1])
    }

    // Also try the flip#list format which uses different URL pattern
    const regex2 = /["']([a-zA-Z0-9_-]{25,})["']\s*[,;]/g
    while ((match = regex2.exec(html)) !== null) {
      // Only add if it looks like a Drive file ID (starts with 1 or 0 typically)
      if (/^[01][a-zA-Z0-9_-]{24,}$/.test(match[1])) {
        fileIds.add(match[1])
      }
    }

    if (fileIds.size === 0) {
      return NextResponse.json({
        success: false,
        error: 'No images found in folder. Make sure the folder contains images and is publicly shared.',
      }, { status: 400 })
    }

    // Convert file IDs to thumbnail URLs (these work without API key)
    const images = Array.from(fileIds).map((id) => ({
      id,
      url: `https://drive.google.com/thumbnail?id=${id}&sz=w1200`,
      directUrl: `https://drive.google.com/uc?export=view&id=${id}`,
    }))

    return NextResponse.json({
      success: true,
      count: images.length,
      images: images.map((img) => img.url),
      folderId,
    })
  } catch (error) {
    console.error('Google Drive folder error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch folder contents. Ensure the folder is publicly shared.',
    }, { status: 500 })
  }
}
